import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

// The site shows videoNext (the video of the new product UI). When the
// editor did not set it, the site shows video.
export const InternalVideoFragment = graphql(
  /* GraphQL */ `
    fragment InternalVideoFragment on InternalVideoRecord {
      video {
        title
        ...VideoPlayerFragment
      }
      nextVideo: videoNext {
        title
        ...VideoPlayerFragment
      }
    }
  `,
  [VideoPlayerFragment],
);
