import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type TemplateDemo = ItemTypeDefinition<
  EnvironmentSettings,
  '810910',
  {
    name: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    code: {
      type: 'slug';
    };
    seo_h1: {
      type: 'string';
    };
    starter_type: {
      type: 'string';
    };
    yoast_analysis: {
      type: 'json';
    };
    badge: {
      type: 'link';
    };
    label: {
      type: 'string';
    };
    cms_description: {
      type: 'text';
    };
    technology: {
      type: 'link';
    };
    github_repo: {
      type: 'string';
    };
    screenshot: {
      type: 'file';
    };
    backend_screenshot: {
      type: 'file';
    };
    readme: {
      type: 'text';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const TemplateDemo = {
  ID: '810910',
  REF: { type: 'item_type', id: '810910' },
} as const;

export type AnyBlock = never;
export type AnyModel = TemplateDemo;
export type AnyBlockOrModel = AnyBlock | AnyModel;

/*
 * A starter is a full demo (fully_fledged) or a starter kit (tech_starter).
 * The community starters are gone, thus starter_type does not accept
 * "community". A second run changes nothing.
 */
export default async function (client: Client): Promise<void> {
  const field = await client.fields.find('template_demo::starter_type');
  const values = 'enum' in field.validators ? (field.validators.enum?.values ?? []) : [];
  if (!values.includes('community')) {
    console.log('Skip: starter_type does not accept community');
    return;
  }
  // The select of the editor shows the same values: remove the option too.
  const { parameters } = field.appearance;
  const options =
    'options' in parameters && Array.isArray(parameters.options) ? parameters.options : [];
  await client.fields.update(field.id, {
    validators: {
      ...field.validators,
      enum: { values: values.filter((value) => value !== 'community') },
    },
    appearance: {
      ...field.appearance,
      parameters: {
        ...parameters,
        options: options.filter((option: { value: string }) => option.value !== 'community'),
      },
    },
  });
  console.log('starter_type: community removed');
}
