import { PixelCoverFragment } from '~/components/PixelCover';
import { ArticlePostFragment } from '../_article';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { BlogPostUrlFragment, buildUrlForBlogPost } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/** The fields of the OG card of the page (`~/lib/ogCards`). */
export const OgCardFragment = graphql(
  /* GraphQL */ `
    fragment PostOgCardFragment on BlogPostRecord {
      title
      slug
      category {
        name
      }
      ...PixelCoverFragment
    }
  `,
  [PixelCoverFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      post: blogPost(filter: { slug: { eq: $slug } }) {
        __typename
        ...ArticlePostFragment
        ...PostOgCardFragment
      }
    }
  `,
  [ArticlePostFragment, OgCardFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allBlogPosts(first: 500) {
            _publishedAt
            ...BlogPostUrlFragment
          }
        }
      `,
      [BlogPostUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForBlogPost(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: blogPost(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
