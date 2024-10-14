import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { UserGuideEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuideEpisode';
import { graphql } from '~/lib/datocms/graphql';

export const TutorialVideoFragment = graphql(
  /* GraphQL */ `
    fragment TutorialVideoFragment on TutorialVideoRecord {
      videoTutorialsOrUserGuideEpisodes: tutorials {
        ... on RecordInterface {
          id
          __typename
        }

        ... on UserGuidesVideoRecord {
          title
          thumbTimeSeconds
          asset: video {
            video {
              thumbnailUrl
              blurUpThumb
              width
              height
            }
          }
          ...UserGuideEpisodeUrlFragment
        }

        ... on VideoTutorialRecord {
          id
          title
          resource: videoTutorialResource {
            ... on RecordInterface {
              id
              __typename
            }
            ... on YoutubeVideoResourceRecord {
              video {
                url
                thumbnailUrl
                providerUid
                title
              }
            }
            ... on OtherVideoResourceRecord {
              url
              coverImage {
                responsiveImage(imgixParams: { auto: format, w: 600, ar: "3:2", fit: crop }) {
                  ...ResponsiveImageFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, UserGuideEpisodeUrlFragment],
);
