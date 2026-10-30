import { ProductComparisonUrlFragment } from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';

export const ProductComparisonInlineFragment = graphql(
  /* GraphQL */ `
    fragment ProductComparisonInlineFragment on ProductComparisonRecord {
      product
      ...ProductComparisonUrlFragment
    }
  `,
  [ProductComparisonUrlFragment],
);
