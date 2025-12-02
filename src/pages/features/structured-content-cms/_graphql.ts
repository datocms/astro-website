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
          ...ReviewQuoteFragment
          ...PartnerTestimonialQuoteFragment
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
          alt
        }
        integrationType {
          slug
        }
        squareLogo {
          url
          alt
        }
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment, VideoPlayerFragment],
);
