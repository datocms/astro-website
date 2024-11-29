import { ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ContentCreators {
      page: homePage {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      review1: review(filter: { name: { eq: "Marc Ammann" } }) {
        __typename
        ...ReviewQuoteFragment
      }
      review2: review(filter: { name: { eq: "Thibaut Davoult" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment],
);
