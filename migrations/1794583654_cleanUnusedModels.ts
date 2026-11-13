import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node';

// Schema type definitions
type EnvironmentSettings = {
  locales: 'en';
};

export type BlogPostTopic = ItemTypeDefinition<
  EnvironmentSettings,
  'ZPFH8dPDQcOKOj-cFYXmcA',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const BlogPostTopic = {
  ID: 'ZPFH8dPDQcOKOj-cFYXmcA',
  REF: { type: 'item_type', id: 'ZPFH8dPDQcOKOj-cFYXmcA' },
} as const;

export type RecipesPage = ItemTypeDefinition<
  EnvironmentSettings,
  'Ye9qbJIORQuaI3oHPNuuwQ',
  {
    seo: {
      type: 'seo';
    };
  }
>;
export const RecipesPage = {
  ID: 'Ye9qbJIORQuaI3oHPNuuwQ',
  REF: { type: 'item_type', id: 'Ye9qbJIORQuaI3oHPNuuwQ' },
} as const;

export type UseCasesPage = ItemTypeDefinition<
  EnvironmentSettings,
  '810903',
  {
    title: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const UseCasesPage = {
  ID: '810903',
  REF: { type: 'item_type', id: '810903' },
} as const;

export type AnyBlock = never;
export type AnyModel = BlogPostTopic | RecipesPage | UseCasesPage;
export type AnyBlockOrModel = AnyBlock | AnyModel;

/*
 * No query reads these models, on the website or in the other apps.
 * - use_cases_page and recipes_page: singletons that no page shows.
 * - blog_post_topic and blog_post.topics: the topics of the blog posts.
 * - Inverse relationships on five models: no query reads the records that
 *   link to them.
 * Each step skips what is already done, thus a second run changes nothing.
 */
const modelsWithoutInverse = [
  'academy_course',
  'showcase_project',
  'customer_story',
  'continent',
  'author',
];

async function findModel(client: Client, apiKey: string) {
  const all = await client.itemTypes.list();
  return all.find((itemType) => itemType.api_key === apiKey);
}

export default async function (client: Client): Promise<void> {
  for (const apiKey of modelsWithoutInverse) {
    const model = await findModel(client, apiKey);
    if (!model || !model.inverse_relationships_enabled) {
      console.log(`Skip ${apiKey}: inverse relationships are off`);
      continue;
    }
    await client.itemTypes.update(model.id, { inverse_relationships_enabled: false });
    console.log(`${apiKey}: inverse relationships off`);
  }

  // The field links to blog_post_topic: delete it before the model.
  const blogPost = await findModel(client, 'blog_post');
  const topics = blogPost
    ? (await client.fields.list(blogPost.id)).find((field) => field.api_key === 'topics')
    : undefined;
  if (topics) {
    await client.fields.destroy(topics.id);
    console.log('blog_post.topics: deleted');
  } else {
    console.log('Skip blog_post.topics: the field does not exist');
  }

  for (const apiKey of ['blog_post_topic', 'use_cases_page', 'recipes_page']) {
    const model = await findModel(client, apiKey);
    if (!model) {
      console.log(`Skip ${apiKey}: the model does not exist`);
      continue;
    }
    await client.itemTypes.destroy(model.id);
    console.log(`${apiKey}: deleted`);
  }
}
