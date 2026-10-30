import { QuoteReviewFragment } from '~/components/Quote';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The closing quote is the review of Stijn Symons (ID adDu814QTBifhlLWVmRAeQ):
 * "It's faster than anything we've used."
 */
export const query = graphql(
  /* GraphQL */ `
    query Developers {
      review(filter: { id: { eq: "adDu814QTBifhlLWVmRAeQ" } }) {
        ...QuoteReviewFragment
      }
    }
  `,
  [QuoteReviewFragment],
);
