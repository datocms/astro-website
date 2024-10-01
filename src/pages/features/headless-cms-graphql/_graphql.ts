import { TagFragment } from '~/lib/datocms/commonFragments';
// import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query HeadlessCmsGraphql($slug: String!, $videoId: UploadId!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        seoH1
        yoastAnalysis
      }
      video: allUploads(filter: { type: { eq: video }, id: { eq: $videoId } }) {
        # ...VideoPlayerFragment
        video {
          muxPlaybackId
        }
      }
    }
  `,
  [TagFragment],
);
