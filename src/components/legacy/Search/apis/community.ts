import ky from 'ky';
import type { Result } from '../types';
import { highlight } from './highlight';

const ENDPOINT = 'https://community.datocms.com/search/query.json';
const CATEGORIES_ENDPOINT = 'https://community.datocms.com/categories.json';

type DiscourseResponse = {
  topics: Array<{
    id: string;
    title: string;
    slug: string;
    category_id: number;
  }>;
  posts: Array<{
    topic_id: string;
    blurb?: string;
  }>;
};

type CategoriesResponse = {
  category_list: {
    categories: Array<{
      id: number;
      name: string;
    }>;
  };
};

let categoriesPromise: Promise<Map<number, string>> | null = null;

function getCategories(): Promise<Map<number, string>> {
  if (!categoriesPromise) {
    categoriesPromise = ky
      .get<CategoriesResponse>(CATEGORIES_ENDPOINT)
      .json()
      .then(({ category_list }) => new Map(category_list.categories.map((c) => [c.id, c.name])))
      .catch((error) => {
        categoriesPromise = null;
        throw error;
      });
  }
  return categoriesPromise;
}

const cache = new Map<string, Result[]>();

export async function searchInCommunity(query: string, signal?: AbortSignal): Promise<Result[]> {
  const cached = cache.get(query);
  if (cached) return cached;

  try {
    const [{ topics, posts }, categories] = await Promise.all([
      ky
        .get<DiscourseResponse>(ENDPOINT, {
          searchParams: {
            include_blurbs: 'true',
            term: query,
          },
          signal,
        })
        .json(),
      getCategories(),
    ]);

    if (!posts) return [];

    const out = posts.map((post) => {
      const topic = topics.find((t) => t.id === post.topic_id)!;
      return {
        title: topic.title,
        url: `https://community.datocms.com/t/${topic.slug}/${topic.id}`,
        category: categories.get(topic.category_id),
        blurb: post.blurb ? highlight(post.blurb, query) : undefined,
      };
    });
    cache.set(query, out);
    return out;
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') throw error;
    console.error(`Error searching the DatoCMS forum: ${error}`);
    return [];
  }
}
