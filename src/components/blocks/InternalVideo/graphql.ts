import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const InternalVideoFragment = graphql(
  /* GraphQL */ `
    fragment InternalVideoFragment on InternalVideoRecord {
      thumbTimeSeconds
      video {
        title
        ...VideoPlayerFragment
      }
    }
  `,
  [VideoPlayerFragment],
);
