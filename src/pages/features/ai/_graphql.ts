import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';

export const query = graphql(
  /* GraphQL */ `
    query DataIntegrity($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        quote {
          __typename
          ...ReviewQuoteFragment
          ...PartnerTestimonialQuoteFragment
        }
        video {
          ...VideoPlayerFragment
        }
      }
    }
  `,
  [TagFragment, VideoPlayerFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment],
);
