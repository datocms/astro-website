import type { Client, SchemaTypes } from '@datocms/cma-client';

export class ItemTypeManager {
  private client: Client;
  private itemTypesPromise: Promise<SchemaTypes.ItemType[]> | null = null;
  private itemTypesByApiKey: Map<string, SchemaTypes.ItemType> = new Map();
  private itemTypesById: Map<string, SchemaTypes.ItemType> = new Map();
  private fieldsByItemType: Map<string, SchemaTypes.Field[]> = new Map();

  constructor(client: Client) {
    this.client = client;
  }

  private async loadItemTypes(): Promise<SchemaTypes.ItemType[]> {
    if (!this.itemTypesPromise) {
      this.itemTypesPromise = (async () => {
        const { data: itemTypes } = await this.client.itemTypes.rawList();

        // Populate the lookup maps
        for (const itemType of itemTypes) {
          this.itemTypesByApiKey.set(itemType.attributes.api_key, itemType);
          this.itemTypesById.set(itemType.id, itemType);
        }

        return itemTypes;
      })();
    }

    return this.itemTypesPromise;
  }

  async getAllItemTypes(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes;
  }

  async getAllModels(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => !it.attributes.modular_block);
  }

  async getAllBlockModels(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => it.attributes.modular_block);
  }

  async getItemTypeByApiKey(apiKey: string): Promise<SchemaTypes.ItemType> {
    await this.loadItemTypes();

    const itemType = this.itemTypesByApiKey.get(apiKey);
    if (!itemType) {
      throw new Error(`Item type with API key '${apiKey}' not found`);
    }

    return itemType;
  }

  async getItemTypeById(id: string): Promise<SchemaTypes.ItemType> {
    await this.loadItemTypes();

    const itemType = this.itemTypesById.get(id);
    if (!itemType) {
      throw new Error(`Item type with ID '${id}' not found`);
    }

    return itemType;
  }

  async getItemTypeFields(itemType: SchemaTypes.ItemType): Promise<SchemaTypes.Field[]> {
    // Check if we already have the fields cached
    const cachedFields = this.fieldsByItemType.get(itemType.id);
    if (cachedFields) {
      return cachedFields;
    }

    // Fetch and cache the fields
    const { data: fields } = await this.client.fields.rawList(itemType.id);
    this.fieldsByItemType.set(itemType.id, fields);

    return fields;
  }
}
