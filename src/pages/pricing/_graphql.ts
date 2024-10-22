import { ReviewQuoteFragment } from '~/components/quote/graphql';
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

export const PlanFeatureGroupFragment = graphql(/* GraphQL */ `
  fragment PlanFeatureGroupFragment on PlanFeatureGroupRecord @_unmask {
    id
    name
    features {
      id
      name
      description {
        value
      }
      tags
      availableOnProfessionalPlan
    }
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
        id
        question
        answer {
          value
        }
      }
      planFeatureGroups: allPlanFeatureGroups(orderBy: position_ASC, first: 100) {
        ...PlanFeatureGroupFragment
      }
      hints: allPricingHints(first: 100) {
        ...HintFragment
      }
      review1: review(filter: { name: { eq: "Tore Heimann" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [ReviewQuoteFragment, TagFragment, HintFragment, PlanFeatureGroupFragment],
);
