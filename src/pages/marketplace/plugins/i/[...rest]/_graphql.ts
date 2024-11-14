import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { MaybeVideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { PluginUrlFragment, buildUrlForPlugin } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query pluginQuery($slug: String!) {
      page: plugin(filter: { packageName: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        description
        previewImage {
          __typename
          ...MaybeVideoPlayerFragment
          responsiveImage(imgixParams: { w: 800, auto: format }) {
            ...ResponsiveImageFragment
          }
        }
        coverImage {
          responsiveImage(imgixParams: { auto: format, w: 400 }) {
            ...ResponsiveImageFragment
          }
        }
        author {
          name
          email
        }
        homepage
        entryPoint
        fieldTypes {
          id
          name
        }
        pluginType {
          name
        }
        packageName
        version
        installs
        lastUpdate
        readme
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, MaybeVideoPlayerFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allPlugins(first: 500) {
            ...PluginUrlFragment
          }
        }
      `,
      [PluginUrlFragment],
    ),
    { includeDrafts },
  );

  return entries.map(buildUrlForPlugin);
};
