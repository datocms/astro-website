import { PartnerTestimonialQuoteFragment } from '~/components/quote/graphql';
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
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        heroCustomer {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        heroProduct {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        quotesHeader {
          value
        }
        quotes {
          __typename
          ...PartnerTestimonialQuoteFragment
        }
        starterTitle {
          value
        }
        starterDescription {
          value
        }
        starterLink: link
        starterImage {
          responsiveImage(imgixParams: { auto: format, w: 1000, h: 1000 }) {
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
            responsiveImage(imgixParams: { auto: format, w: 960, h: 540, fit: crop, crop: top }) {
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
          responsiveImage(imgixParams: { auto: format, w: 1000, h: 1000 }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PartnerTestimonialQuoteFragment],
);
