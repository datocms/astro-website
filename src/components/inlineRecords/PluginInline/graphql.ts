import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';

export const PluginInlineFragment = graphql(
  /* GraphQL */ `
    fragment PluginInlineFragment on PluginRecord {
      title
      ...PluginUrlFragment
    }
  `,
  [PluginUrlFragment],
);
