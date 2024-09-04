import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import {
  PartnerTestimonialFieldsFragment,
  ReviewFieldsFragment,
} from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Product {
      allReviews(first: 100) {
        ...ReviewFieldsFragment
        _updatedAt
      }
      allPartnerTestimonials(first: 100) {
        ...PartnerTestimonialFieldsFragment
        _updatedAt
      }
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
      page: productOverview {
        header {
          value
        }
        subheader {
          value
        }
        pillars {
          id
          theme
          icon {
            url
          }
          pillarCallout
          title {
            value
          }
          capability1 {
            value
          }
          capability2 {
            value
          }
          capability3 {
            value
          }
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
        testimonials {
          ... on PartnerTestimonialRecord {
            ...PartnerTestimonialFieldsFragment
          }
        }
        features {
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
      }
    }
  `,
  [PartnerTestimonialFieldsFragment, ResponsiveImageFragment, ReviewFieldsFragment],
);
