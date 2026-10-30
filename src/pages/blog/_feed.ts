import type { AstroGlobal } from 'astro';
import {
  ChatTeaserFragment,
  PostTeaserFragment,
  type PostTeaserItem,
} from '~/components/PostTeaser';
import * as blog from '~/data/blog';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQuery, executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql, type ResultOf } from '~/lib/datocms/graphql';
import { overrideSeo, seoDescription, seoGeneratedCard, seoTitle } from '~/lib/datocms/seo';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/** The SEO texts of the index of the casual chats, as on the old site. */
const chatsIndex = {
  title: 'Customer Chats',
  description: 'Conversations with customers working on some really cool use cases with DatoCMS',
};

// The client pages through only one list in each query. Thus there are two
// queries for the cards.
export const postsQuery = graphql(
  /* GraphQL */ `
    query BlogFeedPosts($filter: BlogPostModelFilter) {
      items: allBlogPosts(first: 1000, filter: $filter) {
        _firstPublishedAt
        _createdAt
        ...PostTeaserFragment
      }
    }
  `,
  [PostTeaserFragment],
);

export const chatsQuery = graphql(
  /* GraphQL */ `
    query BlogFeedChats {
      items: allCustomerStories(first: 1000) {
        _firstPublishedAt
        _createdAt
        ...ChatTeaserFragment
      }
    }
  `,
  [ChatTeaserFragment],
);

/** The SEO of the index pages, and the categories for the links above the grid. */
export const feedPageQuery = graphql(
  /* GraphQL */ `
    query BlogFeedPage {
      blog {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      customerStoriesIndex {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      categories: allBlogPostCategories(first: 100, orderBy: position_ASC) {
        id
        name
        slug
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);

/** The part of the feed that a page of the index shows. */
export type FeedFilter = { kind: 'all' } | { kind: 'chats' } | { kind: 'category'; slug: string };

type Category = ResultOf<typeof feedPageQuery>['categories'][number];

/**
 * The links above the grid: all the posts, the casual chats, then the
 * categories of the posts, in the order of the CMS. One link is current.
 */
function filterLinks(categories: Category[], filter: FeedFilter) {
  return [
    { ...blog.filters.all, current: filter.kind === 'all' },
    { ...blog.filters.chats, current: filter.kind === 'chats' },
    ...categories.map((category) => ({
      label: category.name,
      href: `/blog/category/${category.slug}`,
      current: filter.kind === 'category' && filter.slug === category.slug,
    })),
  ];
}

/** The address of page 1 of the index. */
export function feedBaseUrl(filter: FeedFilter) {
  if (filter.kind === 'chats') return '/blog/casual-chats';
  if (filter.kind === 'category') return `/blog/category/${filter.slug}`;
  return '/blog';
}

/**
 * Read the page number of an index page. `/p/1` is not a page: page 1
 * is at the address of the index.
 */
export function parsePageIndex(param: string | undefined) {
  if (!param || !/^[1-9]\d*$/.test(param)) return null;
  const page = Number.parseInt(param, 10);
  return page === 1 ? 'redirect' : page;
}

/**
 * The cards of one page of the index: the posts and the casual chats (the
 * model CustomerStory), the newest first. A category shows only its posts,
 * without the casual chats. A query cannot sort two models together: this
 * function gets all the cards, sorts them and takes one page. It gives null
 * when the page or the category does not exist.
 */
export async function loadFeedPage(Astro: AstroGlobal, page: number, filter: FeedFilter) {
  const {
    blog: blogPage,
    customerStoriesIndex,
    categories,
  } = await executeQuery(Astro, feedPageQuery);

  const category =
    filter.kind === 'category' ? categories.find((c) => c.slug === filter.slug) : undefined;
  if (filter.kind === 'category' && !category) return null;

  const postsVariables = { filter: category ? { category: { eq: category.id } } : undefined };

  const [posts, chats] = await Promise.all([
    filter.kind === 'chats'
      ? { items: [] }
      : executeQuery(Astro, postsQuery, { variables: postsVariables }),
    filter.kind === 'category' ? { items: [] } : executeQuery(Astro, chatsQuery),
  ]);

  const feed: (PostTeaserItem & { date: string })[] = [
    ...posts.items.map((post) => ({ post, date: post._firstPublishedAt ?? post._createdAt })),
    ...chats.items.map((chat) => ({ chat, date: chat._firstPublishedAt ?? chat._createdAt })),
  ];
  // The newest first. ISO dates in UTC sort as text.
  feed.sort((a, b) => b.date.localeCompare(a.date));

  const cards = feed
    .slice((page - 1) * blog.perPage, page * blog.perPage)
    .map(({ date: _, ...card }) => card as PostTeaserItem);
  if (cards.length === 0) return null;

  const seo =
    filter.kind === 'chats'
      ? overrideSeo(
          customerStoriesIndex?.seo ?? [],
          seoTitle(chatsIndex.title),
          seoDescription(chatsIndex.description),
          seoGeneratedCard(Astro, { title: chatsIndex.title, excerpt: chatsIndex.description }),
        )
      : filter.kind === 'category'
        ? category!.seo
        : blogPage?.seo;

  return {
    cards,
    page,
    totalPages: Math.ceil(feed.length / blog.perPage),
    baseUrl: feedBaseUrl(filter),
    category,
    filters: filterLinks(categories, filter),
    seo: seo ?? [],
    // The page gives these to DraftModeQueryListener.
    postsVariables: filter.kind === 'chats' ? undefined : postsVariables,
    hasChats: filter.kind !== 'category',
  };
}

export type FeedPage = NonNullable<Awaited<ReturnType<typeof loadFeedPage>>>;

const countsQuery = graphql(/* GraphQL */ `
  query BlogFeedCounts {
    posts: _allBlogPostsMeta {
      count
    }
    chats: _allCustomerStoriesMeta {
      count
    }
    categories: allBlogPostCategories(first: 100) {
      id
      slug
    }
  }
`);

const categoryCountQuery = graphql(/* GraphQL */ `
  query BlogFeedCategoryCount($id: ItemId) {
    meta: _allBlogPostsMeta(filter: { category: { eq: $id } }) {
      count
    }
  }
`);

/** The addresses of the pages 2 and up of an index with this number of cards. */
function laterPages(baseUrl: string, count: number) {
  const total = Math.ceil(count / blog.perPage);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => `${baseUrl}/p/${i + 2}`);
}

/** The sitemap of the pages 2 and up of each index of the blog. */
export function buildFeedSitemapUrls(kind: FeedFilter['kind']): BuildSitemapUrlsFn {
  return async (executeQueryOptions) => {
    const counts = await executeQueryOutsideAstro(countsQuery, executeQueryOptions);

    if (kind === 'all') return laterPages('/blog', counts.posts.count + counts.chats.count);
    if (kind === 'chats') return laterPages('/blog/casual-chats', counts.chats.count);

    const pages = await Promise.all(
      counts.categories.map(async (category) => {
        const { meta } = await executeQueryOutsideAstro(categoryCountQuery, {
          ...executeQueryOptions,
          variables: { id: category.id },
        });
        return laterPages(`/blog/category/${category.slug}`, meta.count);
      }),
    );
    return pages.flat();
  };
}
