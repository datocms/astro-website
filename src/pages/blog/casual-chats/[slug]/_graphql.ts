import { ArticleChatFragment } from '../../_article';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  CustomerStoryUrlFragment,
  buildUrlForCustomerStory,
} from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query ChatQuery($slug: String!) {
      chat: customerStory(filter: { slug: { eq: $slug } }) {
        __typename
        ...ArticleChatFragment
      }
    }
  `,
  [ArticleChatFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allCustomerStories(first: 500) {
            _publishedAt
            ...CustomerStoryUrlFragment
          }
        }
      `,
      [CustomerStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForCustomerStory(entry),
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
        entity: customerStory(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
