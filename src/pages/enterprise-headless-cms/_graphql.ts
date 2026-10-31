import { QuoteReviewFragment } from '~/components/Quote';
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
        ...QuoteReviewFragment
      }
      review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
        ...QuoteReviewFragment
      }
      review3: review(filter: { name: { eq: "Filippo Conforti" } }) {
        ...QuoteReviewFragment
      }
    }
  `,
  [TagFragment, QuoteReviewFragment],
);
