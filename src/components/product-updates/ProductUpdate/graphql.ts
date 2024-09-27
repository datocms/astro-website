import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { ProductUpdateUrlFragment } from '~/lib/datocms/gqlUrlBuilder/productUpdate';
import { graphql } from '~/lib/datocms/graphql';

export const ProductUpdateFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateFragment on ChangelogEntryRecord {
      ...ProductUpdateUrlFragment
      title
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
  [ImageFragment, InternalVideoFragment, ProductUpdateUrlFragment],
);
