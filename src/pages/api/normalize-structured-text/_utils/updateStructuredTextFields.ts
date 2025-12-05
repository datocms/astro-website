import { type RawApiTypes } from '@datocms/cli/lib/cma-client-node';
import { type StructuredTextDocument } from 'datocms-structured-text-to-plain-text';
import {
  forEachNode,
  isBlock,
  type Node,
  type WithChildrenNode,
} from 'datocms-structured-text-utils';

function isItem(maybeItem: unknown): maybeItem is RawApiTypes.Item {
  return Boolean(
    typeof maybeItem === 'object' &&
    maybeItem &&
    'type' in maybeItem &&
    'id' in maybeItem &&
    maybeItem.type === 'item',
  );
}

/**
 * Recursively updates structured text fields within a DatoCMS record/block.
 * Processes all nested blocks and structured text content, applying the provided
 * callback function to each node.
 *
 * @param manager - ItemTypeManager instance for accessing item type information
 * @param item - DatoCMS item to update
 * @param cb - Callback function to apply to each node
 * @returns Updated item data or item ID if no changes were made
 */
export async function updateStructuredTextFields(
  fieldsFinder: (itemTypeId: string) => RawApiTypes.Field[],
  item: RawApiTypes.Item,
  cb: (
    node: Node,
    index: number,
    parent: WithChildrenNode,
    path: string,
    field: RawApiTypes.Field,
  ) => Promise<boolean | undefined>,
  path: string[] = [],
): Promise<RawApiTypes.ItemUpdateSchema['data'] | string> {
  const fields = fieldsFinder(item.relationships.item_type.data.id);

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
      forEachNode(structuredTextValue.document, (node, parent) => {
        const index = parent ? parent.children.indexOf(node as any) : undefined;

        if (isBlock(node)) {
          // Recursively process nested blocks
          const itemBlockOrId = node.item;
          if (isItem(itemBlockOrId)) {
            somethingChangedPromises.push(
              (async () => {
                const result = await updateStructuredTextFields(fieldsFinder, itemBlockOrId, cb, [
                  ...path,
                  field.attributes.api_key,
                ]);
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

        somethingChangedPromises.push(
          cb(
            node,
            index!,
            parent as WithChildrenNode,
            [...path, field.attributes.api_key].join('.'),
            field,
          ),
        );
      });

      const results = await Promise.all(somethingChangedPromises);
      if (results.some(Boolean)) {
        attributes[field.attributes.api_key] = structuredTextValue;
      }
    } else if (field.attributes.field_type === 'rich_text') {
      // Handle rich text fields with nested blocks
      const itemBlocksOrIds = item.attributes[field.attributes.api_key] as (
        | string
        | RawApiTypes.Item
      )[];
      const result: Array<RawApiTypes.ItemUpdateSchema['data'] | string> = [];
      for (const itemBlockOrId of itemBlocksOrIds) {
        result.push(
          isItem(itemBlockOrId)
            ? await updateStructuredTextFields(fieldsFinder, itemBlockOrId, cb, [
                ...path,
                field.attributes.api_key,
                itemBlocksOrIds.indexOf(itemBlockOrId).toString(),
              ])
            : itemBlockOrId,
        );
      }
      if (result.some((itemOrItemId) => typeof itemOrItemId !== 'string')) {
        attributes[field.attributes.api_key] = result;
      }
    } else if (field.attributes.field_type === 'single_block') {
      // Handle single block fields
      const itemBlockOrId = item.attributes[field.attributes.api_key] as
        | string
        | RawApiTypes.Item
        | null;
      if (itemBlockOrId && isItem(itemBlockOrId)) {
        const result = await updateStructuredTextFields(fieldsFinder, itemBlockOrId, cb, [
          ...path,
          field.attributes.api_key,
        ]);
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
