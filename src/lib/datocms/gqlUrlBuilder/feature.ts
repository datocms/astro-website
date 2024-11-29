import { graphql, readFragment, type FragmentOf } from '../graphql';

export const FeatureUrlFragment = graphql(/* GraphQL */ `
  fragment FeatureUrlFragment on FeatureRecord {
    slug
  }
`);

export function buildUrlForFeature(feature: FragmentOf<typeof FeatureUrlFragment>) {
  const data = readFragment(FeatureUrlFragment, feature);
  return `/features/${data.slug}`;
}
