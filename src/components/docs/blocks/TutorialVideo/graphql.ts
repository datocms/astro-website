import { graphql } from '~/lib/datocms/graphql';

export const TutorialVideoFragment = graphql(/* GraphQL */ `
  fragment TutorialVideoFragment on TutorialVideoRecord {
    id
    _modelApiKey
    tutorials {
      ... on RecordInterface {
        id
        _modelApiKey
      }
      ... on RecordInterface {
        id
        _modelApiKey
      }
      ... on UserGuidesVideoRecord {
        title
        slug
        thumbTimeSeconds
        video {
          video {
            thumbnailUrl
            blurUpThumb
            width
            height
          }
        }
        chapters: _allReferencingUserGuidesChapters {
          slug
        }
      }
      ... on VideoTutorialRecord {
        id
        title
        res: videoTutorialResource {
          ... on OtherVideoResourceRecord {
            _modelApiKey
            url
            coverImage {
              responsiveImage(imgixParams: { auto: format, w: 300, ar: "4:3", fit: crop }) {
                ...ResponsiveImageFragment
              }
            }
          }
          ... on YoutubeVideoResourceRecord {
            _modelApiKey
            video {
              url
              thumbnailUrl
              providerUid
            }
          }
        }
      }
    }
  }
`);
