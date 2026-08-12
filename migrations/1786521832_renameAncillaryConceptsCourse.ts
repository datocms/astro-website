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

const COURSE_RENAME = {
  from: 'ancillary-concepts',
  to: 'frontend-frameworks',
  name: 'Frontend Frameworks',
};

const CHAPTER_RENAMES = [
  { from: 'react-concepts', to: 'react' },
  { from: 'astro-concepts', to: 'astro' },
  { from: 'next-js-concepts', to: 'nextjs' },
];

async function renameSlug(
  client: Client,
  itemTypeId: string,
  from: string,
  to: string,
  extra: Record<string, string> = {},
) {
  const [record] = await client.items.list({
    filter: { type: itemTypeId, fields: { slug: { eq: from } } },
  });

  if (!record) {
    console.log(`⏭️  no record with slug "${from}", skipping`);
    return;
  }

  const wasPublished = record.meta.status !== 'draft';

  await client.items.update(record.id, { slug: to, ...extra });

  if (wasPublished) {
    await client.items.publish(record.id);
  }

  console.log(`✅ ${from} → ${to}`);
}

export default async function (client: Client): Promise<void> {
  await renameSlug(client, AcademyCourse.ID, COURSE_RENAME.from, COURSE_RENAME.to, {
    name: COURSE_RENAME.name,
  });

  for (const { from, to } of CHAPTER_RENAMES) {
    await renameSlug(client, AcademyChapter.ID, from, to);
  }
}
