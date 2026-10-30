import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

// The portrait is 120 pixels: three times the size of the slider avatar.

/** A quote of Testimonials: a review. */
export const TestimonialsReviewFragment = graphql(
  /* GraphQL */ `
    fragment TestimonialsReviewFragment on ReviewRecord {
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
    }
  `,
  [ResponsiveImageFragment],
);

/** A quote of Testimonials: the testimonial of a partner. */
export const TestimonialsPartnerTestimonialFragment = graphql(
  /* GraphQL */ `
    fragment TestimonialsPartnerTestimonialFragment on PartnerTestimonialRecord {
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
