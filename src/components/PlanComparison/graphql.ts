import { graphql } from '~/lib/datocms/graphql';

/** A group of features, from the CMS. Enterprise has every feature. */
export const PlanComparisonFeatureGroupFragment = graphql(/* GraphQL */ `
  fragment PlanComparisonFeatureGroupFragment on PlanFeatureGroupRecord {
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
