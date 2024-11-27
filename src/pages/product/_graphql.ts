import { FeatureCardFragment } from '~/components/FeatureCard/graphql';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
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
        _seoMetaTags {
          ...TagFragment
        }
        header {
          value
        }
        subheader {
          value
        }
        pillars {
          id
          theme
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
            responsiveImage(imgixParams: { auto: format, w: 1000, h: 1000 }) {
              ...ResponsiveImageFragment
            }
          }
        }
        quotes: testimonials {
          __typename
          ...PartnerTestimonialQuoteFragment
          ...ReviewQuoteFragment
        }
        features {
          featureGroup
          ...FeatureCardFragment
        }
      }
    }
  `,
  [
    ResponsiveImageFragment,
    PartnerTestimonialQuoteFragment,
    FeatureCardFragment,
    ReviewQuoteFragment,
    TagFragment,
  ],
);
