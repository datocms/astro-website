import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';

export const query = graphql(
  /* GraphQL */ `
    query VisualEditing($slug: String!) {
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
