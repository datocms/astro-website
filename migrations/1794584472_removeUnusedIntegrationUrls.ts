import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type Integration = ItemTypeDefinition<
  EnvironmentSettings,
  '810918',
  {
    logo: {
      type: 'file';
    };
    name: {
      type: 'string';
    };
    logo_dark: {
      type: 'file';
    };
    integration_type: {
      type: 'link';
    };
    square_logo: {
      type: 'file';
    };
    project_url: {
      type: 'string';
    };
    square_logo_dark: {
      type: 'file';
    };
    landing_url: {
      type: 'string';
    };
    documentation_url: {
      type: 'string';
    };
    plugin_url: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    websites: {
      type: 'json';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Integration = {
  ID: '810918',
  REF: { type: 'item_type', id: '810918' },
} as const;

export type AnyBlock = never;
export type AnyModel = Integration;
export type AnyBlockOrModel = AnyBlock | AnyModel;

/*
 * No page and no other app reads these three URLs of an integration. The
 * migration deletes them. A second run changes nothing.
 */
const fields = [
  'integration::landing_url',
  'integration::plugin_url',
  'integration::documentation_url',
];

export default async function (client: Client): Promise<void> {
  for (const id of fields) {
    // Skip a field that does not exist, thus a second run changes nothing.
    let field;
    try {
      field = await client.fields.find(id);
    } catch {
      console.log(`Skip ${id}: the field does not exist`);
      continue;
    }
    await client.fields.destroy(field.id);
    console.log(`${id}: deleted`);
  }
}
