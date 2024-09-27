import { graphql, readFragment, type FragmentOf } from '../graphql';

export const ProductUpdateUrlFragment = graphql(/* GraphQL */ `
  fragment ProductUpdateUrlFragment on ChangelogEntryRecord {
    slug
  }
`);

export function buildUrlForProductUpdate(
  productUpdate: FragmentOf<typeof ProductUpdateUrlFragment>,
) {
  const data = readFragment(ProductUpdateUrlFragment, productUpdate);
  return `/product-updates/${data.slug}`;
}
