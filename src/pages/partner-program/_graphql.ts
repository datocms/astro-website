import { TestimonialsPartnerTestimonialFragment } from '~/components/Testimonials';
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
      partnerTestimonials: allPartnerTestimonials(first: 25) {
        __typename
        ...TestimonialsPartnerTestimonialFragment
        quote {
          value
        }
        _updatedAt
      }
    }
  `,
  [TestimonialsPartnerTestimonialFragment, PartnerUrlFragment],
);
