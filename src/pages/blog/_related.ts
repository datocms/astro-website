import type { AstroGlobal } from 'astro';
import { ChatCardFragment, PostCardFragment, type PostCardItem } from '~/components/PostCard';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { graphql, type ResultOf } from '~/lib/datocms/graphql';

/**
 * The post before and the post after, by date of first publication. Posts
 * and casual chats are one feed: the page keeps the nearer of each pair.
 */
export const siblingsQuery = graphql(
  /* GraphQL */ `
    query SiblingsQuery($dateTime: DateTime, $slug: String) {
      previousPost: blogPost(
        filter: { _firstPublishedAt: { lt: $dateTime } }
        orderBy: _firstPublishedAt_DESC
      ) {
        _firstPublishedAt
        ...PostCardFragment
      }
      previousChat: customerStory(
        filter: { _firstPublishedAt: { lt: $dateTime } }
        orderBy: _firstPublishedAt_DESC
      ) {
        _firstPublishedAt
        ...ChatCardFragment
      }
      nextPost: blogPost(
        filter: { _firstPublishedAt: { gt: $dateTime }, slug: { neq: $slug } }
        orderBy: _firstPublishedAt_ASC
      ) {
        _firstPublishedAt
        ...PostCardFragment
      }
      nextChat: customerStory(
        filter: { _firstPublishedAt: { gt: $dateTime }, slug: { neq: $slug } }
        orderBy: _firstPublishedAt_ASC
      ) {
        _firstPublishedAt
        ...ChatCardFragment
      }
    }
  `,
  [PostCardFragment, ChatCardFragment],
);

type Siblings = ResultOf<typeof siblingsQuery>;

/** Keep the nearer of a post and a chat. ISO dates in UTC sort as text. */
function nearer(
  post: Siblings['previousPost'],
  chat: Siblings['previousChat'],
  later: boolean,
): PostCardItem | null {
  if (post && (!chat || post._firstPublishedAt > chat._firstPublishedAt === later)) {
    return { post };
  }
  return chat ? { chat } : null;
}

/** The two articles (posts or chats) around an article, for RelatedPosts. */
export async function loadRelated(
  Astro: AstroGlobal,
  article: { slug: string; _firstPublishedAt: string | null; _createdAt: string },
) {
  const variables = {
    dateTime: article._firstPublishedAt ?? article._createdAt,
    slug: article.slug,
  };
  const siblings = await executeQuery(Astro, siblingsQuery, { variables });

  return [
    nearer(siblings.previousPost, siblings.previousChat, true),
    nearer(siblings.nextPost, siblings.nextChat, false),
  ].filter((item) => item !== null);
}
