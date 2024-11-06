import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForSuccessStory,
  SuccessStoryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      page: successStory(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        title {
          value
        }
        coverImage {
          url
          focalPoint {
            x
            y
          }
        }
        logo {
          url
        }
        challenge {
          value
        }
        result {
          value
        }
        numbers {
          number
          label
        }
        mainResultsImage {
          url
          focalPoint {
            x
            y
          }
        }
        mainResults {
          title
          description {
            value
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
            ... on InDepthCtaBlockRecord {
              id
              _modelApiKey
              cta {
                title
                description {
                  value
                }
                ctaLabel
                ctaUrl
              }
            }
          }
        }
      }
    }
  `,
  [TagFragment, VideoFragment, ImageFragment, InternalVideoFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allSuccessStories(first: 500) {
            ...SuccessStoryUrlFragment
          }
        }
      `,
      [SuccessStoryUrlFragment],
    ),
    { includeDrafts },
  );

  return entries.map(buildUrlForSuccessStory);
};
