import { TagFragment } from '~/lib/datocms/commonFragments';
import {
  PartnerTestimonialQuoteFragment,
  ReviewQuoteFragment,
} from '~/components/quote/SingleQuote/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query RealTimeApi($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        quote {
          __typename
          ... on ReviewRecord {
            ...ReviewQuoteFragment
          }
          ... on PartnerTestimonialRecord {
            ...PartnerTestimonialQuoteFragment
          }
        }
        video {
          ...VideoPlayerFragment
        }
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment, VideoPlayerFragment],
);
