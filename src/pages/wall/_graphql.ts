import {
  TestimonialsPartnerTestimonialFragment,
  TestimonialsReviewFragment,
} from '~/components/Testimonials';
import { graphql } from '~/lib/datocms/graphql';

/*
 * All the reviews and all the partner testimonials. The page shows them
 * together, the newest first.
 */
export const query = graphql(
  /* GraphQL */ `
    query WallOfLove {
      allReviews(first: 100) {
        __typename
        _updatedAt
        ...TestimonialsReviewFragment
      }
      allPartnerTestimonials(first: 500) {
        __typename
        _updatedAt
        ...TestimonialsPartnerTestimonialFragment
      }
    }
  `,
  [TestimonialsReviewFragment, TestimonialsPartnerTestimonialFragment],
);
