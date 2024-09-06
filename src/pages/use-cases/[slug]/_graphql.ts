import { PartnerTestimonialQuotesCarouselFragment } from '~/components/QuotesCarousel/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query UseCase($slug: String!) {
      page: useCasePage(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        title {
          value
        }
        subtitle {
          value
        }
        heroImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        heroCustomer {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        heroProduct {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        quotesHeader {
          value
        }
        quotes {
          __typename
          ...PartnerTestimonialQuotesCarouselFragment
        }
        starterTitle {
          value
        }
        starterDescription {
          value
        }
        starterLink: link
        starterImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        featuresHeader
        featuresDescription: description {
          value
        }
        callout {
          title
          description {
            value
          }
          image {
            responsiveImage {
              ...ResponsiveImageFragment
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
          }
        }
        successStoryHeader {
          value
        }
        successStorySummary: summary {
          value
        }
        caseStudy {
          ... on RecordInterface {
            __typename
          }
          ... on SuccessStoryRecord {
            slug
          }
          ... on ShowcaseProjectRecord {
            slug
            partner {
              slug
            }
          }
          ... on CustomerStoryRecord {
            slug
          }
        }
        successStoryImage: image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PartnerTestimonialQuotesCarouselFragment],
);
