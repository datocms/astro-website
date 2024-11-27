import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForUserGuidesEpisode,
  UserGuidesEpisodeUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const EpisodeFragment = graphql(
  /* GraphQL */ `
    fragment EpisodeFragment on UserGuidesEpisodeRecord {
      title
      asset: video {
        video {
          thumbnailUrl
          width
          height
          blurUpThumb
          duration
        }
      }
      thumbTimeSeconds
      ...UserGuidesEpisodeUrlFragment
    }
  `,
  [UserGuidesEpisodeUrlFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query UserGuidesItemQuery($episodeSlug: String!) {
      episode: userGuidesEpisode(filter: { slug: { eq: $episodeSlug } }) {
        id
        _seoMetaTags {
          ...TagFragment
        }
        title
        asset: video {
          ...VideoPlayerFragment
          video {
            duration
          }
        }
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
          }
        }
      }
      chapters: allUserGuidesChapters(orderBy: position_ASC) {
        id
        title
        slug
        episodes: videos {
          id
          ...EpisodeFragment
          ...UserGuidesEpisodeUrlFragment
        }
      }
    }
  `,
  [
    TagFragment,
    VideoPlayerFragment,
    InternalVideoFragment,
    EpisodeFragment,
    UserGuidesEpisodeUrlFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allUserGuidesEpisodes(first: 500) {
            ...UserGuidesEpisodeUrlFragment
          }
        }
      `,
      [UserGuidesEpisodeUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForUserGuidesEpisode);
};
