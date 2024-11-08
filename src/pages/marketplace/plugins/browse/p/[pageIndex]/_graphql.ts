import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

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
    }
  `,
  [TagFragment, ResponsiveImageFragment, PluginUrlFragment],
);
