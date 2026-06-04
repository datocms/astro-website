import { TagFragment } from '~/lib/datocms/commonFragments';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query DarkMode {
      page: feature(filter: { slug: { eq: "dark-mode" } }) {
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
