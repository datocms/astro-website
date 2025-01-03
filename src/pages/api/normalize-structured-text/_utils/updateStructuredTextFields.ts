import { SchemaTypes } from '@datocms/cli/lib/cma-client-node';
import { type StructuredTextDocument } from 'datocms-structured-text-to-plain-text';
import { isBlock, type Node, type WithChildrenNode } from 'datocms-structured-text-utils';
import { visit } from 'unist-util-visit';

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
export async function updateStructuredTextFields(
  fieldsFinder: (itemTypeId: string) => SchemaTypes.Field[],
  touchedStructuredTextFields: Set<SchemaTypes.Field>,
  item: SchemaTypes.Item,
  cb: (
    node: Node,
    index: number,
    parent: WithChildrenNode,
    path: string,
  ) => Promise<boolean | undefined>,
  path: string[] = [],
): Promise<SchemaTypes.ItemUpdateSchema['data'] | string> {
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
      visit(structuredTextValue.document, (node, index, parent) => {
        if (isBlock(node)) {
          // Recursively process nested blocks
          const itemBlock = node.item as any as SchemaTypes.Item;
          if (itemBlock) {
            somethingChangedPromises.push(
              (async () => {
                const result = await updateStructuredTextFields(
                  fieldsFinder,
                  touchedStructuredTextFields,
                  itemBlock,
                  cb,
                  [...path, field.attributes.api_key],
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

        somethingChangedPromises.push(
          cb(
            node,
            index!,
            parent as WithChildrenNode,
            [...path, field.attributes.api_key].join('.'),
          ),
        );
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
          await updateStructuredTextFields(
            fieldsFinder,
            touchedStructuredTextFields,
            itemBlock,
            cb,
            [...path, field.attributes.api_key, itemBlocks.indexOf(itemBlock).toString()],
          ),
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
          fieldsFinder,
          touchedStructuredTextFields,
          itemBlock,
          cb,
          [...path, field.attributes.api_key],
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
