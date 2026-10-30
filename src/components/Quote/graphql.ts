import { graphql } from '~/lib/datocms/graphql';

/** A review of the CMS, shown as a big quote. */
export const QuoteReviewFragment = graphql(/* GraphQL */ `
  fragment QuoteReviewFragment on ReviewRecord {
    name
    role
    quote {
      value
    }
  }
`);

/** A testimonial of a partner, shown as a big quote with the photo of the person. */
export const QuotePartnerTestimonialFragment = graphql(/* GraphQL */ `
  fragment QuotePartnerTestimonialFragment on PartnerTestimonialRecord {
    name
    role
    quote {
      value
    }
    image {
      url(imgixParams: { auto: format, w: 80, h: 80, fit: crop, crop: faces })
    }
    partner {
      name
    }
  }
`);
