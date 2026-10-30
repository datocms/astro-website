import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { graphql } from '~/lib/datocms/graphql';

export const FeatureLinkFragment = graphql(
  /* GraphQL */ `
    fragment FeatureLinkFragment on FeatureRecord {
      ...FeatureUrlFragment
    }
  `,
  [FeatureUrlFragment],
);
