import { QuotePartnerTestimonialFragment, QuoteReviewFragment } from '~/components/Quote';
import { graphql } from '~/lib/datocms/graphql';

/*
 * All the reviews and all the partner testimonials. The page shows them
 * together, the newest first, with the featured quotes at equal distances. 500 is the largest page of the CDA (the
 * client pages only one list of a query). The counts tell the page when a
 * list is longer than its page.
 */
export const query = graphql(
  /* GraphQL */ `
    query WallOfLove {
      reviewsMeta: _allReviewsMeta {
        count
      }
      partnerTestimonialsMeta: _allPartnerTestimonialsMeta {
        count
      }
      allReviews(first: 500) {
        __typename
        _createdAt
        featured
        ...QuoteReviewFragment
      }
      allPartnerTestimonials(first: 500) {
        __typename
        _createdAt
        featured
        ...QuotePartnerTestimonialFragment
      }
    }
  `,
  [QuoteReviewFragment, QuotePartnerTestimonialFragment],
);
