import { QuotesCarouselFragment } from '~/components/QuotesCarousel/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { FeatureCardFragment } from '~/components/FeatureCard/graphql';
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
          featureGroup
          ...FeatureCardFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment, QuotesCarouselFragment, FeatureCardFragment],
);
