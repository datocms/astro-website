import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query EnterpriseHeadlessCmsPage {
      tutorials: allVideoTutorials(first: 100) {
        id
        title
        res: videoTutorialResource {
          ... on RecordInterface {
            __typename
          }
          ... on OtherVideoResourceRecord {
            url
            coverImage {
              responsiveImage(imgixParams: { auto: format, w: 600, ar: "4:3", fit: crop }) {
                ...ResponsiveImageFragment
              }
            }
          }
          ... on YoutubeVideoResourceRecord {
            video {
              url
              thumbnailUrl
              providerUid
            }
          }
        }
        _publishedAt
      }
    }
  `,
  [ResponsiveImageFragment],
);
