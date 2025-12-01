import { TagFragment } from '~/lib/datocms/commonFragments';
import { TechPartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/techPartner';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query allTechPartners {
      page: techPartnersPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        highlightedPartners {
          slug
          name
        }
      }
      techPartners: allTechPartners {
        ...TechPartnerUrlFragment
        name
        slug
        logo {
          url
          alt
        }
        shortDescription {
          value
        }
        areasOfExpertise {
          name
        }
        technologies {
          name
        }
      }
    }
  `,
  [TagFragment, TechPartnerUrlFragment],
);
