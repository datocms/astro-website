import { graphql } from '~/lib/datocms/graphql';

export const InternalVideoFragment = graphql(/* GraphQL */ `
  fragment InternalVideoFragment on InternalVideoRecord {
    id
    _modelApiKey
    thumbTimeSeconds
    video {
      title
      width
      height
      blurUpThumb
      video {
        playbackId: muxPlaybackId
      }
    }
  }
`);
