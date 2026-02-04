import { range } from 'lodash-es';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { graphql } from '~/lib/datocms/graphql';
import { PluginCardFragment } from '~/pages/marketplace/_sub/PluginCard/_graphql';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

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

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const {
    meta: { count },
  } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: "false" } }) {
          count
        }
      }
    `),
    executeQueryOptions,
  );

  return range(2, 1 + Math.ceil(count / perPage)).map(
    (i): SitemapEntry => ({ url: `/marketplace/plugins/browse/p/${i}` }),
  );
};
