import { graphql } from '~/lib/datocms/graphql';

export const InternalVideoFragment = graphql(/* GraphQL */ `
  fragment InternalVideoFragment on InternalVideoRecord {
    video {
      title
      alt
      video {
        streamingUrl
        mp4Url(res: high)
        thumbnailUrl
        width
        height
        blurUpThumb
      }
    }
  }
`);
