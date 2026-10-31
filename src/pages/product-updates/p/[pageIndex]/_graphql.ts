import { ProductUpdateListFragment } from '~/components/ProductUpdateList';
import * as productUpdates from '~/data/product-updates';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/**
 * Former links go to pages up to page 30 (10 entries on each page). A page
 * in this range that does not exist now redirects to the last page.
 */
export const legacyLastPage = 30;

/** One page of the index: the newest entries first. */
export const pageQuery = graphql(
  /* GraphQL */ `
    query ProductUpdatesPage($first: IntType!, $skip: IntType!) {
      changelog {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      entries: allChangelogEntries(
        first: $first
        skip: $skip
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...ProductUpdateListFragment
      }
      meta: _allChangelogEntriesMeta {
        count
      }
    }
  `,
  [TagFragment, ProductUpdateListFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { meta } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allChangelogEntriesMeta {
          count
        }
      }
    `),
    executeQueryOptions,
  );

  const total = Math.ceil(meta.count / productUpdates.perPage);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => `/product-updates/p/${i + 2}`);
};
