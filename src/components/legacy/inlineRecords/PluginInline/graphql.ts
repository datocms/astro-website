import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';

export const PluginInlineFragment = graphql(
  /* GraphQL */ `
    fragment PluginInlineFragment on PluginRecord {
      title
      ...PluginUrlFragment
      coverImage {
        url(imgixParams: { auto: format, w: 90, h: 50, fit: crop })
      }
    }
  `,
  [PluginUrlFragment],
);
