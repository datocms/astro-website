import { FeatureCardFragment } from '~/components/FeatureCard/graphql';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
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
        first: 11
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...CustomerStoryUrlFragment
        title
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fill: blur, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
      useCases: allUseCasePages(first: 4, orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]) {
        ...UseCasePageUrlFragment
        title: navigationBarTitle
        subtitle {
          value
        }
        heroCustomer {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fill: blur, fit: crop }) {
            ...ResponsiveImageFragment
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
    UseCasePageUrlFragment,
  ],
);
