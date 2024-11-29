import { ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query DigitalMarketing {
      page: teamPage(filter: { slug: { eq: "cms-digital-marketing" } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
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
      review1: review(filter: { name: { eq: "Russell Gardner" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment],
);
