import { QuoteReviewFragment } from '~/components/Quote';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The closing quote is the review of Marc Ammann (ID 39832301): "This is
 * precisely what I want: a CMS that's been built by an agency because they
 * know what my clients need."
 */
export const query = graphql(
  /* GraphQL */ `
    query EditorExperience {
      review(filter: { id: { eq: "39832301" } }) {
        ...QuoteReviewFragment
      }
    }
  `,
  [QuoteReviewFragment],
);
