import { TagFragment } from '~/lib/datocms/commonFragments';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import {
  ReviewQuoteFragment,
  PartnerTestimonialQuoteFragment,
} from '~/components/quote/SingleQuote/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query HeadlessCmsGraphql($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        quote {
          ... on ReviewRecord {
            __typename
            ...ReviewQuoteFragment
          }
          ... on PartnerTestimonialRecord {
            __typename
            ...PartnerTestimonialQuoteFragment
          }
        }
        video {
          ...VideoPlayerFragment
        }
        seoH1
        yoastAnalysis
      }
    }
  `,
  [TagFragment, VideoPlayerFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment],
);
