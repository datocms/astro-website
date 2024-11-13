import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { PluginCardFragment } from '../_sub/PluginCard/_graphql';

export const query = graphql(
  /* GraphQL */ `
    query Enterprise {
      page: pluginsPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        highlighted {
          ...PluginCardFragment
        }
        collections {
          title
          plugins {
            ...PluginCardFragment
          }
        }
      }

      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: "false" } }) {
        count
      }

      latest: allPlugins(
        first: 12
        orderBy: _createdAt_DESC
        filter: { manuallyDeprecated: { eq: "false" } }
      ) {
        ...PluginCardFragment
      }

      popular: allPlugins(
        first: 12
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: "false" } }
      ) {
        ...PluginCardFragment
      }
    }
  `,
  [TagFragment, PluginCardFragment],
);
