import { FaqQuestionFragment } from '~/components/Faq';
import { PlanComparisonFeatureGroupFragment } from '~/components/PlanComparison';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const HintFragment = graphql(/* GraphQL */ `
  fragment HintFragment on PricingHintRecord @_unmask {
    apiId
    name
    description
    position
  }
`);

export const query = graphql(
  /* GraphQL */ `
    query Pricing {
      page: pricingPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      faqs: allFaqs {
        ...FaqQuestionFragment
      }
      planFeatureGroups: allPlanFeatureGroups(orderBy: position_ASC, first: 100) {
        ...PlanComparisonFeatureGroupFragment
      }
      hints: allPricingHints(first: 500) {
        ...HintFragment
      }
    }
  `,
  [TagFragment, HintFragment, FaqQuestionFragment, PlanComparisonFeatureGroupFragment],
);
