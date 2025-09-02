import ky from 'ky';
import type { Result } from './types';
import { Highlight } from './Highlight';
import { escapeRegExp } from 'lodash-es';

type DiscourseResponse = {
  topics: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  posts: Array<{
    topic_id: string;
    blurb: string;
  }>;
};

export async function searchInCommunity(query: string): Promise<Result[]> {
  try {
    const { topics, posts } = await ky
      .get<DiscourseResponse>('https://community.datocms.com/search/query.json', {
        searchParams: {
          include_blurbs: 'true',
          term: query,
        },
      })
      .json();

    if (!posts) {
      return [];
    }

    const regexp = new RegExp(`(${escapeRegExp(query)})`, 'i');

    return posts.map((post) => {
      const topic = topics.find((t) => t.id === post.topic_id)!;
      return {
        title: <Highlight regexp={regexp}>{topic.title}</Highlight>,
        body: <Highlight regexp={regexp}>{post.blurb}</Highlight>,
        url: `https://community.datocms.com/t/${topic.slug}/${topic.id}`,
      };
    });
  } catch (error) {
    console.error(`Error seaching the DatoCMS forum: ${error}`);
    return [];
  }
}
