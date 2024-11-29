import { graphql, readFragment, type FragmentOf } from '../graphql';

export const ProductComparisonUrlFragment = graphql(/* GraphQL */ `
  fragment ProductComparisonUrlFragment on ProductComparisonRecord {
    slug
  }
`);

export function buildUrlForProductComparison(
  productComparison: FragmentOf<typeof ProductComparisonUrlFragment>,
) {
  const data = readFragment(ProductComparisonUrlFragment, productComparison);
  return `/compare/${data.slug}`;
}
