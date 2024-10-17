import { ReviewQuoteFragment } from '~/components/quote/SingleQuote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Developers {
      page: teamPage(filter: { slug: { eq: "best-cms-for-developers" } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        slug
        seoH1
        yoastAnalysis
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
      review(filter: { name: { eq: "Guillermo Rauch" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment],
);
