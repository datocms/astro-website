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
      }
      techPartners: allTechPartners {
        ...TechPartnerUrlFragment
        name
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
