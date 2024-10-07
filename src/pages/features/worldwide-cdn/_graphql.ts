import { TagFragment } from '~/lib/datocms/commonFragments';
import {
  PartnerTestimonialQuoteFragment,
  ReviewQuoteFragment,
} from '~/components/quote/SingleQuote/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query WorldwideCdn($slug: String!) {
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
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment],
);