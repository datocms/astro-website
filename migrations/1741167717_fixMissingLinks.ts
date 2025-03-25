import { Client } from '@datocms/cli/lib/cma-client-node';
import { uniq } from 'lodash-es';
import { linkableModelApiKeys } from './extras/extras';
import { ItemTypeManager } from './extras/itemTypeManager';

export default async function (client: Client) {
  const manager = new ItemTypeManager(client);

  const linkableModelIds = (
    await Promise.all(
      linkableModelApiKeys.map(async (apiKey) => manager.getItemTypeByApiKey(apiKey)),
    )
  ).map((model) => model.id);

  for (const itemType of await manager.getAllItemTypes()) {
    for (const field of await manager.getItemTypeFields(itemType)) {
      if (field.attributes.field_type !== 'structured_text') {
        continue;
      }

      const validator = field.attributes.validators.structured_text_links as {
        item_types: string[];
      };

      if (validator.item_types.length < 20 && field.id !== 'A0rLr8QZRKaoEB9ssyENvw') {
        continue;
      }

      await client.fields.update(field, {
        validators: {
          ...field.attributes.validators,
          structured_text_links: {
            ...validator,
            item_types: uniq([...validator.item_types, ...linkableModelIds]),
          },
        },
      });
    }
  }
}
