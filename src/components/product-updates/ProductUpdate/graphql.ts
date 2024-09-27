import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const ProductUpdateFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateFragment on ChangelogEntryRecord {
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
  `,
  [ImageFragment, InternalVideoFragment],
);
