import { TagFragment } from '~/lib/datocms/commonFragments';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query VideoApi($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        video {
          ...VideoPlayerFragment
        }
      }
    }
  `,
  [TagFragment, VideoPlayerFragment],
);
