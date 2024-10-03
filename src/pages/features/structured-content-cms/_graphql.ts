import { TagFragment } from '~/lib/datocms/commonFragments';
import { ReviewQuoteFragment } from '~/components/quote/SingleQuote/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query StructuredContentCms($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
      }
      review: review(filter: { name: { eq: "Dominic Blain" } }) {
        __typename
        ...ReviewQuoteFragment
      }
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment],
);
