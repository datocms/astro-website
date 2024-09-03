import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '../ResponsiveImage/graphql';

export const QuotesCarouselFragment = graphql(
  /* GraphQL */ `
    fragment QuotesCarouselFragment on PartnerTestimonialRecord {
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
