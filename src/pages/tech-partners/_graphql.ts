import { TechPartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/techPartner';
import { TagFragment } from '~/lib/datocms/commonFragments';
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
