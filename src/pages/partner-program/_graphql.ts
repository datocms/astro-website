import { PartnerTestimonialQuotesCarouselFragment } from '~/components/quote/QuotesCarousel/graphql';
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
          }
          ...PartnerUrlFragment
        }
      }
      partnerTestimonials: allPartnerTestimonials(first: 10) {
        __typename
        ...PartnerTestimonialQuotesCarouselFragment
        quote {
          value
        }
        _updatedAt
      }
    }
  `,
  [PartnerTestimonialQuotesCarouselFragment, PartnerUrlFragment],
);
