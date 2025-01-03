import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query DynamicLayouts($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        quote {
          __typename
          ...ReviewQuoteFragment
          ...PartnerTestimonialQuoteFragment
        }
        quote2 {
          __typename
          ...ReviewQuoteFragment
          ...PartnerTestimonialQuoteFragment
        }
      }
    }
  `,
  [TagFragment, ReviewQuoteFragment, PartnerTestimonialQuoteFragment],
);
