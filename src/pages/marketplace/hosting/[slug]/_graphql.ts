import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  HostingAppUrlFragment,
  buildUrlForHostingApp,
} from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query EnterpriseAppQuery($slug: String!) {
      page: hostingApp(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        description
        shortDescription
        logo {
          url
          width
          height
        }
        gallery {
          id
          responsiveImage(imgixParams: { auto: format, w: 1200, h: 800, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on VideoRecord {
              ...VideoFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, ImageFragment, VideoFragment, InternalVideoFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allHostingApps(first: 100) {
            ...HostingAppUrlFragment
          }
        }
      `,
      [HostingAppUrlFragment],
    ),
    { includeDrafts },
  );

  return entries.map(buildUrlForHostingApp);
};
