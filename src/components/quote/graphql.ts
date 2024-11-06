import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

export const PartnerTestimonialQuoteFragment = graphql(
  /* GraphQL */ `
    fragment PartnerTestimonialQuoteFragment on PartnerTestimonialRecord {
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
        ...PartnerUrlFragment
      }
    }
  `,
  [ResponsiveImageFragment, PartnerUrlFragment],
);

export const ReviewQuoteFragment = graphql(
  /* GraphQL */ `
    fragment ReviewQuoteFragment on ReviewRecord {
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
