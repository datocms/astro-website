import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { graphql } from '~/lib/datocms/graphql';

export const FeatureInlineFragment = graphql(
  /* GraphQL */ `
    fragment FeatureInlineFragment on FeatureRecord {
      seoH1
      ...FeatureUrlFragment
    }
  `,
  [FeatureUrlFragment],
);
