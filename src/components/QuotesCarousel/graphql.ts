import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '../ResponsiveImage/graphql';

export const PartnerTestimonialQuotesCarouselFragment = graphql(
  /* GraphQL */ `
    fragment PartnerTestimonialQuotesCarouselFragment on PartnerTestimonialRecord {
      __typename
      quote {
        value
      }
      role
      name
      image {
        responsiveImage(imgixParams: { w: 300, h: 300, fit: crop, crop: faces, auto: format }) {
          ...ResponsiveImageFragment
        }
      }
      partner {
        name
        slug
      }
    }
  `,
  [ResponsiveImageFragment],
);

export const ReviewQuotesCarouselFragment = graphql(
  /* GraphQL */ `
    fragment ReviewQuotesCarouselFragment on ReviewRecord {
      __typename
      quote {
        value
      }
      role
      name
      image {
        responsiveImage(imgixParams: { w: 300, h: 300, fit: crop, crop: faces, auto: format }) {
          ...ResponsiveImageFragment
        }
      }
      name
      role
    }
  `,
  [ResponsiveImageFragment],
);
