import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForUserGuideEpisode,
  UserGuideEpisodeUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/userGuideEpisode';
import { graphql } from '~/lib/datocms/graphql';

export const EpisodeFragment = graphql(
  /* GraphQL */ `
    fragment EpisodeFragment on UserGuidesVideoRecord {
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
      ...UserGuideEpisodeUrlFragment
    }
  `,
  [UserGuideEpisodeUrlFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query UserGuidesItemQuery($episodeSlug: String!) {
      episode: userGuidesVideo(filter: { slug: { eq: $episodeSlug } }) {
        slug
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
        slug
        title
        episodes: videos {
          slug
          ...EpisodeFragment
        }
      }
    }
  `,
  [TagFragment, VideoPlayerFragment, InternalVideoFragment, EpisodeFragment],
);

export const buildSitemapUrls = async () => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allUserGuidesVideos(first: 500) {
            ...UserGuideEpisodeUrlFragment
          }
        }
      `,
      [UserGuideEpisodeUrlFragment],
    ),
  );

  return entries.map(buildUrlForUserGuideEpisode);
};
