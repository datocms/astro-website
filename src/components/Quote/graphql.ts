import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

/*
 * A quote is a review or the testimonial of a partner. Select `__typename`
 * next to the fragment: `readQuote` reads the fragment of that type.
 * The portrait is 120 pixels: three times the size of the largest avatar.
 */

/** A review of the CMS. The company is a field, and the website is its link. */
export const QuoteReviewFragment = graphql(
  /* GraphQL */ `
    fragment QuoteReviewFragment on ReviewRecord {
      name
      role
      company
      website
      quote {
        value
      }
      image {
        responsiveImage(imgixParams: { w: 120, h: 120, fit: crop, crop: faces }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);

/** The testimonial of a partner. The company is the partner, and its page is the link. */
export const QuotePartnerTestimonialFragment = graphql(
  /* GraphQL */ `
    fragment QuotePartnerTestimonialFragment on PartnerTestimonialRecord {
      name
      role
      quote {
        value
      }
      image {
        responsiveImage(imgixParams: { w: 120, h: 120, fit: crop, crop: faces }) {
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
