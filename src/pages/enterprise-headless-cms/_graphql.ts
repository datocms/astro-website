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
      # The review of Severin Klaus (DEPT®). The quote closes the chapter on support.
      review(filter: { id: { eq: "IcdguI91QDOyM_KZs1izcw" } }) {
        __typename
        ...QuoteReviewFragment
      }
    }
  `,
  [TagFragment, QuoteReviewFragment],
);
