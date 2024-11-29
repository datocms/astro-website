import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query StructuredContentCms($slug: String!) {
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
        video2 {
          ...VideoPlayerFragment
        }
        video3 {
          ...VideoPlayerFragment
        }
      }
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment, VideoPlayerFragment],
);
