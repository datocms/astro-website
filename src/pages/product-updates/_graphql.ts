import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
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
      posts: allChangelogEntries(first: $limit, skip: $offset, orderBy: _firstPublishedAt_DESC) {
        id
        title
        slug
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
          }
        }
        _firstPublishedAt
        categories {
          name
          color {
            hex
          }
        }
      }
      _allChangelogEntriesMeta {
        count
      }
    }
  `,
  [TagFragment, ImageFragment, InternalVideoFragment],
);
