import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Wall {
      allReviews(first: 100) {
        __typename
        ...ReviewQuoteFragment
        _updatedAt
        name
        role
        quote {
          value
        }
      }
      allPartnerTestimonials(first: 500) {
        __typename
        ...PartnerTestimonialQuoteFragment
        _updatedAt
        name
        role
        quote {
          value
        }
        partner {
          name
        }
      }
    }
  `,
  [PartnerTestimonialQuoteFragment, ReviewQuoteFragment],
);
