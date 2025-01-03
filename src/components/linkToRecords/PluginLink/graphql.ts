import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';

export const PluginLinkFragment = graphql(
  /* GraphQL */ `
    fragment PluginLinkFragment on PluginRecord {
      ...PluginUrlFragment
    }
  `,
  [PluginUrlFragment],
);
