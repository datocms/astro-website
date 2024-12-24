import { Client, SchemaTypes } from '@datocms/cli/lib/cma-client-node';
import { render, type StructuredTextDocument } from 'datocms-structured-text-to-plain-text';
import {
  isBlock,
  isLink,
  type ItemLink,
  type Node,
  type WithChildrenNode,
} from 'datocms-structured-text-utils';
import { uniq } from 'lodash-es';
import { match } from 'path-to-regexp';
import { visit } from 'unist-util-visit';
import {
  itemFinders,
  knownPaths,
  linkableModelApiKeys,
  redirects,
  type FinderResult,
} from './extras/extras';
import { ItemTypeManager } from './extras/itemTypeManager';

/**
 * Attempts to find a DatoCMS item ID corresponding to a given pathname.
 * Uses predefined itemFinders to match the pathname against known patterns
 * and retrieve the corresponding item.
 *
 * @param client - DatoCMS client instance
 * @param pathname - URL pathname to look up
 * @returns Either a tuple of [modelApiKey, itemId] or 'INVALID_ROUTE'
 */
async function fetchItemIdForPathname(client: Client, pathname: string): Promise<FinderResult> {
  for (const { pattern, finder } of itemFinders) {
    const matcher = match(pattern, { decode: decodeURIComponent });
    const result = matcher(pathname);

    if (result) {
      return finder(client, result.params);
    }
  }

  return 'INVALID_ROUTE';
}

/**
 * Recursively updates structured text fields within a DatoCMS record/block.
 * Processes all nested blocks and structured text content, applying the provided
 * callback function to each node.
 *
 * @param manager - ItemTypeManager instance for accessing item type information
 * @param touchedStructuredTextFields - Set of fields that have been modified
 * @param item - DatoCMS item to update
 * @param cb - Callback function to apply to each node
 * @returns Updated item data or item ID if no changes were made
 */
async function updateStructuredTextFields(
  manager: ItemTypeManager,
  touchedStructuredTextFields: Set<SchemaTypes.Field>,
  item: SchemaTypes.Item,
  cb: (node: Node, index: number, parent: WithChildrenNode) => Promise<boolean | undefined>,
): Promise<SchemaTypes.ItemUpdateSchema['data'] | string> {
  const itemType = await manager.getItemTypeById(item.relationships.item_type.data.id);
  const fields = await manager.getItemTypeFields(itemType);

  const attributes: Record<string, unknown> = {};

  // Process each field in the item
  for (const field of fields) {
    if (field.attributes.field_type === 'structured_text') {
      // Handle structured text fields
      const structuredTextValue = item.attributes[
        field.attributes.api_key
      ] as StructuredTextDocument | null;

      if (!structuredTextValue) {
        continue;
      }

      const somethingChangedPromises: Array<Promise<boolean | undefined>> = [];

      // Visit each node in the structured text
      visit(structuredTextValue.document, (node, index, parent) => {
        if (isBlock(node)) {
          // Recursively process nested blocks
          const itemBlock = node.item as any as SchemaTypes.Item;
          if (itemBlock) {
            somethingChangedPromises.push(
              (async () => {
                const result = await updateStructuredTextFields(
                  manager,
                  touchedStructuredTextFields,
                  itemBlock,
                  cb,
                );
                if (typeof result === 'string') {
                  node.item = result;
                } else {
                  node.item = result as any;
                  return true;
                }
              })(),
            );
          }
        }

        somethingChangedPromises.push(cb(node, index!, parent as WithChildrenNode));
      });

      const results = await Promise.all(somethingChangedPromises);
      if (results.some(Boolean)) {
        attributes[field.attributes.api_key] = structuredTextValue;
        touchedStructuredTextFields.add(field);
      }
    } else if (field.attributes.field_type === 'rich_text') {
      // Handle rich text fields with nested blocks
      const itemBlocks = item.attributes[field.attributes.api_key] as SchemaTypes.Item[];
      const result: Array<SchemaTypes.ItemUpdateSchema['data'] | string> = [];
      for (const itemBlock of itemBlocks) {
        result.push(
          await updateStructuredTextFields(manager, touchedStructuredTextFields, itemBlock, cb),
        );
      }
      if (result.some((item) => typeof item !== 'string')) {
        attributes[field.attributes.api_key] = result;
      }
    } else if (field.attributes.field_type === 'single_block') {
      // Handle single block fields
      const itemBlock = item.attributes[field.attributes.api_key] as SchemaTypes.Item | null;
      if (itemBlock) {
        const result = await updateStructuredTextFields(
          manager,
          touchedStructuredTextFields,
          itemBlock,
          cb,
        );
        if (typeof result !== 'string') {
          attributes[field.attributes.api_key] = result;
        }
      }
    }
  }

  if (Object.entries(attributes).length > 0) {
    return { type: 'item', id: item.id, attributes, relationships: item.relationships };
  }

  return item.id;
}

/**
 * Main migration function that processes all records in DatoCMS to:
 *
 * 1. Remove empty links
 * 2. Fix malformed URLs (e.g., duplicate https://, trailing slashes)
 * 3. Apply redirects for known URL patterns
 * 4. Convert regular links to internal DatoCMS item links where possible
 * 5. Update field validators to allow linking to all linkable content types
 *
 * The script maintains publishing state by republishing items that were
 * previously published after making updates.
 *
 * @param client - DatoCMS client instance
 */
export default async function (client: Client) {
  const manager = new ItemTypeManager(client);

  const updateOperations: Array<[Parameters<typeof client.items.rawUpdate>, boolean]> = [];
  const touchedStructuredTextFields = new Set<SchemaTypes.Field>();

  // Process all models and their items
  for (const model of await manager.getAllModels()) {
    for await (const record of client.items.rawListPagedIterator({
      filter: { type: model.id },
      nested: true,
    })) {
      const result = await updateStructuredTextFields(
        manager,
        touchedStructuredTextFields,
        record,
        async (node, index, parent) => {
          if (!isLink(node)) {
            return;
          }

          // Remove empty links
          if (!node.url) {
            console.log(
              '[REMOVE_EMPTY_LINK]',
              `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${model.id}/items/${record.id}`,
              `"${render(node)}"`,
            );

            parent.children = [
              ...parent.children.slice(0, index),
              ...node.children,
              ...parent.children.slice(index + 1),
            ] as any;

            return true;
          }

          // Skip anchor links
          if (node.url.startsWith('#')) {
            return;
          }

          let url: URL;

          try {
            url = new URL(node.url, 'https://www.datocms.com/');
          } catch {
            console.error('Invalid URL', node.url);
            return;
          }

          const corrections: string[] = [];

          // Fix URLs with duplicate https://
          if (url.pathname.indexOf('https://') >= 0) {
            corrections.push(`dupicate https ${url.pathname}`);
            url.pathname = url.pathname.slice(0, url.pathname.indexOf('https://'));
          }

          // Process external links
          if (url.hostname !== 'www.datocms.com') {
            const normalizedUrl = url.toString();

            if (node.url !== normalizedUrl) {
              console.log(
                '[CORRECT_LINK]',
                `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${model.id}/items/${record.id}`,
                `"${render(node)}"`,
                node.url,
                '->',
                normalizedUrl,
              );

              node.url = normalizedUrl;
              return true;
            }

            return;
          }

          // Remove trailing slashes
          if (url.pathname.endsWith('/')) {
            corrections.push('trailing slash');
            url.pathname = url.pathname.slice(0, -1);
          }

          // Apply redirects
          for (const redirect of redirects) {
            const result = redirect.matcher(url.pathname);
            if (result) {
              const newPathname = redirect.replacer(result.params);
              corrections.push(`redirect ${url.pathname} -> ${newPathname}`);
              url.pathname = newPathname;
            }
          }

          const result = await fetchItemIdForPathname(client, url.pathname);

          const normalizedUrl = url.pathname + url.hash + url.search;

          // Convert URL links to internal DatoCMS item links where possible
          if (Array.isArray(result)) {
            const [_modelApiKey, itemId] = result;

            const itemLinkNode = node as any as ItemLink;
            itemLinkNode.type = 'itemLink';
            itemLinkNode.item = itemId;

            const meta = itemLinkNode.meta || [];
            if (url.hash) {
              meta.push({ id: 'hash', value: url.hash });
            }
            if (url.search) {
              meta.push({ id: 'search', value: url.search });
            }
            if (meta.length > 0) {
              itemLinkNode.meta = meta;
            }
            delete (itemLinkNode as any).url;

            console.log(
              '[REPLACE_WITH_RECORD]',
              `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${model.id}/items/${record.id}`,
              `"${render(node)}"`,
              corrections.length === 0 ? '' : JSON.stringify(corrections),
              itemLinkNode.meta ? JSON.stringify(itemLinkNode.meta) : '',
            );

            return true;
          } else if (node.url !== normalizedUrl) {
            console.log(
              '[CORRECT_LINK]',
              `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${model.id}/items/${record.id}`,
              `"${render(node)}"`,
              node.url,
              '->',
              normalizedUrl,
            );

            node.url = normalizedUrl;
            return true;
          } else if (!knownPaths.includes(url.pathname)) {
            console.log(
              `[${result}]`,
              `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${model.id}/items/${record.id}`,
              `"${render(node)}"`,
              corrections.length === 0 ? '' : JSON.stringify(corrections),
              url.toString(),
            );
          }
        },
      );

      if (typeof result !== 'string') {
        updateOperations.push([[record.id, { data: result }], record.meta.status === 'published']);
      }
    }
  }

  // Update field validators to allow linking to all linkable content types
  const linkableModelIds = (
    await Promise.all(
      linkableModelApiKeys.map(async (apiKey) => manager.getItemTypeByApiKey(apiKey)),
    )
  ).map((model) => model.id);

  for (const field of touchedStructuredTextFields) {
    const validator = field.attributes.validators.structured_text_links as { item_types: string[] };

    await client.fields.update(field, {
      appearance: {
        ...field.attributes.appearance,
        editor: 'structured_text',
        parameters: { ...field.attributes.appearance.parameters, show_links_meta_editor: true },
      },
      validators: {
        ...field.attributes.validators,
        structured_text_links: {
          ...validator,
          item_types: uniq([...validator.item_types, ...linkableModelIds]),
        },
      },
    });
  }

  // Apply all updates and maintain publishing state
  for (const [updateOperation, republish] of updateOperations) {
    await client.items.rawUpdate(...updateOperation);
    if (republish) {
      try {
        await client.items.publish(updateOperation[0]);
      } catch (e) {
        const record = await client.items.find(updateOperation[0]);
        const recordUrl = `https://datocms.admin.datocms.com/environments/links-test/editor/item_types/${record.item_type.id}/items/${record.id}`;
        console.log(`Could not republish ${recordUrl}`);
      }
    }
  }
}
