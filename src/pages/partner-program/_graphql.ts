import { QuotePartnerTestimonialFragment } from '~/components/Quote';
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
            width
            height
          }
          ...PartnerUrlFragment
        }
      }
      # Three featured partner testimonials, the newest first.
      partnerTestimonials: allPartnerTestimonials(
        filter: { featured: { eq: true } }
        orderBy: _createdAt_DESC
        first: 3
      ) {
        __typename
        ...QuotePartnerTestimonialFragment
      }
    }
  `,
  [QuotePartnerTestimonialFragment, PartnerUrlFragment],
);
