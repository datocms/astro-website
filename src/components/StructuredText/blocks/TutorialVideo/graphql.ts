import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { UserGuidesEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';

export const TutorialVideoFragment = graphql(
  /* GraphQL */ `
    fragment TutorialVideoFragment on TutorialVideoRecord {
      videoTutorialsOrUserGuidesEpisodes: tutorials {
        ... on RecordInterface {
          id
          __typename
        }

        ... on UserGuidesEpisodeRecord {
          title
          asset: video {
            video {
              thumbnailUrl
              blurUpThumb
              width
              height
            }
          }
          ...UserGuidesEpisodeUrlFragment
        }

        ... on VideoTutorialRecord {
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
                responsiveImage(imgixParams: { w: 600, ar: "3:2", fit: crop }) {
                  ...ResponsiveImageFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, UserGuidesEpisodeUrlFragment],
);
