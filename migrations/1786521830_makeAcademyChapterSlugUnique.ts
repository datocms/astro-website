import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

type EnvironmentSettings = {
  locales: 'en';
};

export type AcademyChapter = ItemTypeDefinition<
  EnvironmentSettings,
  'UJ1OC5KlT226qOIdOvQ7Hg',
  {
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    content: {
      type: 'structured_text';
    };
    seo: {
      type: 'seo';
    };
    yoast_analysis: {
      type: 'json';
    };
  }
>;
export const AcademyChapter = {
  ID: 'UJ1OC5KlT226qOIdOvQ7Hg',
  REF: { type: 'item_type', id: 'UJ1OC5KlT226qOIdOvQ7Hg' },
} as const;

export default async function (client: Client): Promise<void> {
  const fields = await client.fields.list(AcademyChapter.REF);
  const slugField = fields.find((field) => field.api_key === 'slug');

  if (!slugField) {
    throw new Error('academy_chapter has no slug field');
  }

  if ('unique' in slugField.validators) {
    console.log('⏭️  academy_chapter.slug is already unique, skipping');
    return;
  }

  await client.fields.update(slugField.id, {
    validators: { ...slugField.validators, unique: {} },
  });

  console.log('✅ academy_chapter.slug: added unique validator');
}
