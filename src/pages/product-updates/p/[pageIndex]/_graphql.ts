import { range } from 'lodash-es';
import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const perPage = 10;

export const query = graphql(
  /* GraphQL */ `
    query ProductUpdates($limit: IntType!, $offset: IntType!) {
      page: changelog {
        _seoMetaTags {
          ...TagFragment
        }
      }
      productUpdates: allChangelogEntries(
        first: $limit
        skip: $offset
        orderBy: _firstPublishedAt_DESC
      ) {
        ...ProductUpdateFragment
      }
      _allChangelogEntriesMeta {
        count
      }
    }
  `,
  [TagFragment, ProductUpdateFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const {
    meta: { count },
  } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allChangelogEntriesMeta {
          count
        }
      }
    `),
    { includeDrafts },
  );

  return range(2, 1 + Math.ceil(count / perPage)).map((i) => `/product-updates/p/${i}`);
};
