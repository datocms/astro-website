import { graphql } from '~/lib/datocms/graphql';

export const VideoPlayerFragment = graphql(/* GraphQL */ `
  fragment VideoPlayerFragment on VideoFileField {
    video {
      # Required: this field identifies the video.
      muxPlaybackId
      title
      alt
      # The size gives the aspect ratio of the player.
      width
      height
      # A blurred image that shows while the video loads.
      blurUpThumb
      # The poster. Without a time, it resolves to the poster time of the upload.
      thumbnailUrl
    }
  }
`);
