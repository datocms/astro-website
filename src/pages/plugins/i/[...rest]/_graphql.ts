import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { PluginUrlFragment, buildUrlForPlugin } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/** The fields of the OG card of the page (`~/lib/ogCards`). */
export const OgCardFragment = graphql(/* GraphQL */ `
  fragment PluginOgCardFragment on PluginRecord {
    title
    description
    installs
    version
    author {
      name
      official
    }
    coverImage {
      # A cover that is not 3:2 keeps its top left corner, as a screenshot.
      url(imgixParams: { w: 960, h: 640, fit: crop, crop: [top, left], fm: jpg })
    }
  }
`);

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
          responsiveImage(imgixParams: { w: 800 }) {
            ...ResponsiveImageFragment
          }
          video {
            title
            alt
            streamingUrl
            mp4Url(res: high)
            thumbnailUrl
            width
            height
            blurUpThumb
          }
        }
        coverImage {
          responsiveImage(imgixParams: { w: 600 }) {
            ...ResponsiveImageFragment
          }
        }
        author {
          name
          email
          official
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
  [TagFragment, ResponsiveImageFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allPlugins(first: 500) {
            _publishedAt
            ...PluginUrlFragment
          }
        }
      `,
      [PluginUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForPlugin(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
};

export const paramsToRecordId: ParamsToRecordIdFn<{ rest: string }> = async ({
  executeQueryOptions,
  params: { rest },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: plugin(filter: { packageName: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug: rest } },
  );

  return entity?.id;
};
