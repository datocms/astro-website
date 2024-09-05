import { QuotesCarouselFragment } from '~/components/QuotesCarousel/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Product {
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
        quotes: testimonials {
          ...QuotesCarouselFragment
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
  [ResponsiveImageFragment, QuotesCarouselFragment],
);
