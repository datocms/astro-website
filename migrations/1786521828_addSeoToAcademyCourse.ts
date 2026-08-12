import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

type EnvironmentSettings = {
  locales: 'en';
};

export type AcademyCourse = ItemTypeDefinition<
  EnvironmentSettings,
  'U3kd4iQNQbeKldEq1whk8Q',
  {
    illustration: {
      type: 'string';
    };
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    introduction: {
      type: 'structured_text';
    };
    chapters: {
      type: 'links';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const AcademyCourse = {
  ID: 'U3kd4iQNQbeKldEq1whk8Q',
  REF: { type: 'item_type', id: 'U3kd4iQNQbeKldEq1whk8Q' },
} as const;

export default async function (client: Client): Promise<void> {
  const fields = await client.fields.list(AcademyCourse.REF);

  if (fields.some((field) => field.api_key === 'seo')) {
    console.log('⏭️  academy_course already has a seo field, skipping');
    return;
  }

  await client.fields.create(AcademyCourse.REF, {
    label: 'SEO',
    api_key: 'seo',
    field_type: 'seo',
    validators: {
      title_length: { max: 60 },
      description_length: { max: 160 },
    },
    appearance: {
      addons: [],
      editor: 'seo',
      parameters: {
        fields: ['title', 'description', 'image', 'no_index', 'twitter_card'],
        previews: ['google', 'twitter', 'facebook', 'slack', 'telegram', 'whatsapp'],
      },
    },
  });

  console.log('✅ academy_course: created seo field');
}
