import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Post($slug: String!) {
      post: changelogEntry(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
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
    }
  `,
  [TagFragment, ResponsiveImageFragment, InternalVideoFragment, ImageFragment],
);
