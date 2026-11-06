import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type DifferencesOnTopic = ItemTypeDefinition<
  EnvironmentSettings,
  'M8ubDKZ1TpaB-IOqO_h7MQ',
  {
    topic: {
      type: 'string';
    };
    differences: {
      type: 'rich_text';
      blocks: ProductDifference;
    };
  }
>;
export const DifferencesOnTopic = {
  ID: 'M8ubDKZ1TpaB-IOqO_h7MQ',
  REF: { type: 'item_type', id: 'M8ubDKZ1TpaB-IOqO_h7MQ' },
} as const;

export type Importer = ItemTypeDefinition<
  EnvironmentSettings,
  'WTE6HYFdTXq8Co90Q1Zbuw',
  {
    header: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    learn_more_slug: {
      type: 'slug';
    };
  }
>;
export const Importer = {
  ID: 'WTE6HYFdTXq8Co90Q1Zbuw',
  REF: { type: 'item_type', id: 'WTE6HYFdTXq8Co90Q1Zbuw' },
} as const;

export type ProductComparison = ItemTypeDefinition<
  EnvironmentSettings,
  'U_IVjjGWTvKdFmOfUlJWHQ',
  {
    datocms_characterization: {
      type: 'structured_text';
    };
    when_to_choose_datocms: {
      type: 'structured_text';
    };
    when_to_choose_competitor: {
      type: 'structured_text';
    };
    importer: {
      type: 'single_block';
      blocks: Importer;
    };
    reasons: {
      type: 'rich_text';
      blocks: ReasonToConsider;
    };
    slug: {
      type: 'slug';
    };
    testimonials: {
      type: 'links';
    };
    topics: {
      type: 'rich_text';
      blocks: DifferencesOnTopic;
    };
    competitor_characterization: {
      type: 'structured_text';
    };
    product: {
      type: 'string';
    };
    seo_social: {
      type: 'seo';
    };
  }
>;
export const ProductComparison = {
  ID: 'U_IVjjGWTvKdFmOfUlJWHQ',
  REF: { type: 'item_type', id: 'U_IVjjGWTvKdFmOfUlJWHQ' },
} as const;

export type ProductDifference = ItemTypeDefinition<
  EnvironmentSettings,
  'PwpYYgGtTUShgE8OhyQrpA',
  {
    datocms_take: {
      type: 'structured_text';
    };
    competitor_take: {
      type: 'structured_text';
    };
  }
>;
export const ProductDifference = {
  ID: 'PwpYYgGtTUShgE8OhyQrpA',
  REF: { type: 'item_type', id: 'PwpYYgGtTUShgE8OhyQrpA' },
} as const;

export type ReasonToConsider = ItemTypeDefinition<
  EnvironmentSettings,
  'NwCxRpLVQ3q-CoPiDVO-Iw',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export const ReasonToConsider = {
  ID: 'NwCxRpLVQ3q-CoPiDVO-Iw',
  REF: { type: 'item_type', id: 'NwCxRpLVQ3q-CoPiDVO-Iw' },
} as const;

export type AnyBlock = DifferencesOnTopic | Importer | ProductDifference | ReasonToConsider;
export type AnyModel = ProductComparison;
export type AnyBlockOrModel = AnyBlock | AnyModel;

const TODO = {
  schema: 'dast',
  document: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'span', value: '[TODO]' }] }],
  },
} as const;

const SEO_FIELDSET_ID = 'cjwFW8syQsKFyKPo3gRZow';

const NEW_FIELDS = [
  {
    label: 'When to choose DatoCMS',
    api_key: 'when_to_choose_datocms',
    hint: 'The type of team and project for which DatoCMS is the better choice.',
  },
  {
    label: 'When to choose the competitor',
    api_key: 'when_to_choose_competitor',
    hint: 'The type of team and project for which the competitor is the better choice.',
  },
] as const;

/*
 * The compare pages end with two texts: when to choose DatoCMS, and when to
 * choose the competitor. This migration adds these two fields. Each record
 * gets the value [TODO] and is published again, because a required field must
 * have a value and the site reads the published version. The migration can
 * run again: it skips the fields that exist, and it changes only the records
 * that have no value.
 */
export default async function (client: Client): Promise<void> {
  const existingFields = await client.fields.list(ProductComparison.ID);
  const existingKeys = new Set(existingFields.map((field) => field.api_key));

  const fieldsets = await client.fieldsets.list(ProductComparison.ID);
  let fieldset = fieldsets.find((item) => item.title === '🤔 When to choose');

  if (!fieldset) {
    await client.fieldsets.update(SEO_FIELDSET_ID, { position: 8 });
    fieldset = await client.fieldsets.create(ProductComparison.ID, {
      title: '🤔 When to choose',
      position: 7,
    });
  }

  const createdFieldIds: string[] = [];

  for (const [index, field] of NEW_FIELDS.entries()) {
    if (existingKeys.has(field.api_key)) continue;

    const created = await client.fields.create(ProductComparison.ID, {
      ...field,
      field_type: 'structured_text',
      position: index,
      fieldset: { type: 'fieldset', id: fieldset.id },
      validators: {
        structured_text_blocks: { item_types: [] },
        structured_text_links: {
          on_publish_with_unpublished_references_strategy: 'fail',
          on_reference_unpublish_strategy: 'delete_references',
          on_reference_delete_strategy: 'delete_references',
          item_types: [],
        },
        structured_text_inline_blocks: { item_types: [] },
      },
      appearance: {
        addons: [],
        editor: 'structured_text',
        parameters: {
          marks: ['strong', 'emphasis'],
          nodes: ['link'],
          heading_levels: [],
          blocks_start_collapsed: false,
          show_links_meta_editor: false,
          show_links_target_blank: true,
        },
      },
    });

    createdFieldIds.push(created.id);
  }

  for await (const record of client.items.listPagedIterator<ProductComparison>({
    filter: { type: 'product_comparison' },
    version: 'latest',
  })) {
    const missing = NEW_FIELDS.filter((field) => !record[field.api_key]);
    if (missing.length === 0) continue;

    await client.items.update(record.id, {
      ...Object.fromEntries(missing.map((field) => [field.api_key, TODO])),
    });
    await client.items.publish(record.id);
  }

  for (const id of createdFieldIds) {
    const field = await client.fields.find(id);
    await client.fields.update(id, { validators: { ...field.validators, required: {} } });
  }
}
