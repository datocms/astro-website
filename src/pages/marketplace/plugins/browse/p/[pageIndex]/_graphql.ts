import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { PluginCardFragment } from '~/pages/marketplace/_sub/PluginCard/_graphql';

export const perPage = 36;

export const query = graphql(
  /* GraphQL */ `
    query PluginsShowcase($limit: IntType!, $offset: IntType!) {
      _allPluginsMeta(filter: { manuallyDeprecated: { eq: "false" } }) {
        count
      }

      pluginsPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }

      plugins: allPlugins(
        first: $limit
        skip: $offset
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: false } }
      ) {
        ...PluginCardFragment
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PluginCardFragment],
);
