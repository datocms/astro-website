import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';

const pluginFieldsFragment = graphql(
  /* GraphQL */ `
    fragment pluginFields on PluginRecord @_unmask {
      __typename
      ...PluginUrlFragment
      id
      title
      description
      releasedAt
      coverImage {
        responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment, PluginUrlFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query Enterprise {
      page: pluginsPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        highlighted {
          ...pluginFields
        }
        collections {
          title
          plugins {
            ...pluginFields
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
        ...pluginFields
      }

      popular: allPlugins(
        first: 12
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: "false" } }
      ) {
        ...pluginFields
      }
    }
  `,
  [TagFragment, pluginFieldsFragment],
);
