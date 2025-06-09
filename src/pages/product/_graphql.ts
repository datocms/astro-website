import { FeatureCardFragment } from '~/components/FeatureCard/graphql';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
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
      customerStories: allCustomerStories(
        first: 12
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...CustomerStoryUrlFragment
        title
        excerpt {
          value
        }
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fill: blur, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        people {
          name
          title
          company
          avatar {
            responsiveImage(imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }) {
              ...ResponsiveImageFragment
            }
          }
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
    CustomerStoryUrlFragment,
  ],
);
