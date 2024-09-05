import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';

export const FeatureCardFragment = graphql(
  /* GraphQL */ `
    fragment FeatureCardFragment on OverviewFeatureRecord {
      id
      title
      icon {
        url
      }
      description {
        value
      }
      highlight
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      link {
        __typename
        ... on DocPageRecord {
          id
          slug
          parent: _allReferencingDocGroups {
            slug
          }
        }
        ... on FeatureRecord {
          id
          slug
        }
      }
      featureGroup
    }
  `,
  [ResponsiveImageFragment],
);
