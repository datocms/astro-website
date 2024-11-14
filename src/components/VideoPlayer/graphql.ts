import { graphql, readFragment, type FragmentOf } from '~/lib/datocms/graphql';

export const VideoPlayerFragment = graphql(/* GraphQL */ `
  fragment VideoPlayerFragment on VideoFileField {
    video {
      # required: this field identifies the video to be played
      muxPlaybackId

      # all the other fields are not required but:

      # if provided, title is displayed in the upper left corner of the video
      title

      # if provided, width and height are used to define the aspect ratio of the
      # player, so to avoid layout jumps during the rendering.
      width
      height

      # if provided, it shows a blurred placeholder for the video
      blurUpThumb
    }
  }
`);

export const MaybeVideoPlayerFragment = graphql(/* GraphQL */ `
  fragment MaybeVideoPlayerFragment on FileField {
    video {
      # required: this field identifies the video to be played
      muxPlaybackId

      # all the other fields are not required but:

      # if provided, title is displayed in the upper left corner of the video
      title

      # if provided, width and height are used to define the aspect ratio of the
      # player, so to avoid layout jumps during the rendering.
      width
      height

      # if provided, it shows a blurred placeholder for the video
      blurUpThumb
    }
  }
`);

export function isVideo(
  videoFragment: FragmentOf<typeof MaybeVideoPlayerFragment>,
): videoFragment is FragmentOf<typeof VideoPlayerFragment> &
  FragmentOf<typeof MaybeVideoPlayerFragment> {
  const { video } = readFragment(MaybeVideoPlayerFragment, videoFragment);
  return Boolean(video);
}
