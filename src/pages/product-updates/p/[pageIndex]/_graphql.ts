import { ProductUpdateFragment } from '~/components/product-updates/ProductUpdate/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

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
