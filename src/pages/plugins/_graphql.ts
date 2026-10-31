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
      }

      collections: allPluginCollections(orderBy: position_ASC) {
        title
        plugins {
          ...PluginCardFragment
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

      officialAuthors: allPluginAuthors(filter: { official: { eq: true } }, first: 20) {
        id
      }
    }
  `,
  [TagFragment, PluginCardFragment],
);

export const officialPluginsQuery = graphql(
  /* GraphQL */ `
    query OfficialPlugins($authorIds: [ItemId]!) {
      official: allPlugins(
        first: 6
        orderBy: installs_DESC
        filter: { author: { in: $authorIds }, manuallyDeprecated: { eq: "false" } }
      ) {
        ...PluginCardFragment
      }

      officialMeta: _allPluginsMeta(
        filter: { author: { in: $authorIds }, manuallyDeprecated: { eq: "false" } }
      ) {
        count
      }
    }
  `,
  [PluginCardFragment],
);
