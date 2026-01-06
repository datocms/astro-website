import { HintFragment } from '../_graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query PricingCalculator {
      hints: allPricingHints(first: 500) {
        ...HintFragment
      }
    }
  `,
  [HintFragment],
);
