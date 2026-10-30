import { QuoteReviewFragment } from '~/components/Quote';
import { graphql } from '~/lib/datocms/graphql';

/*
 * The closing quote is the review of Grace Guzman (ID 39832305):
 * "Thanks to DatoCMS we are able to serve massive spikes of terabytes of
 * optimized images per day…"
 */
export const query = graphql(
  /* GraphQL */ `
    query Media {
      review(filter: { id: { eq: "39832305" } }) {
        ...QuoteReviewFragment
      }
    }
  `,
  [QuoteReviewFragment],
);
