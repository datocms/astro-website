import { PartnerTestimonialQuoteFragment } from '~/components/quote/graphql';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query PartnerProgram {
      page: partnersPage {
        highlightedPartners {
          name
          logo {
            url
            alt
          }
          ...PartnerUrlFragment
        }
      }
      partnerTestimonials: allPartnerTestimonials(first: 10) {
        __typename
        ...PartnerTestimonialQuoteFragment
        quote {
          value
        }
        _updatedAt
      }
    }
  `,
  [PartnerTestimonialQuoteFragment, PartnerUrlFragment],
);
