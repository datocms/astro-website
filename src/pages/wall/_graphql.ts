import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Wall {
      allReviews(first: 100) {
        __typename
        ...ReviewQuoteFragment
        _updatedAt
      }
      allPartnerTestimonials(first: 100) {
        __typename
        ...PartnerTestimonialQuoteFragment
        _updatedAt
      }
    }
  `,
  [PartnerTestimonialQuoteFragment, ReviewQuoteFragment],
);
