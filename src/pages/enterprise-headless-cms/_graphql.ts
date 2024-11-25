import { ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query EnterpriseHeadlessCmsPage {
      page: teamPage(filter: { slug: { eq: "enterprise-headless-cms" } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        slug
        seoH1
        yoastAnalysis
      }
      review1: review(filter: { name: { eq: "Dan Barak" } }) {
        __typename
        ...ReviewQuoteFragment
      }
      review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
        __typename
        ...ReviewQuoteFragment
      }
      review3: review(filter: { name: { eq: "Filippo Conforti" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment],
);
