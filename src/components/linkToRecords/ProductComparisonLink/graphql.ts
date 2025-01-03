import { ProductComparisonUrlFragment } from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';

export const ProductComparisonLinkFragment = graphql(
  /* GraphQL */ `
    fragment ProductComparisonLinkFragment on ProductComparisonRecord {
      ...ProductComparisonUrlFragment
    }
  `,
  [ProductComparisonUrlFragment],
);
