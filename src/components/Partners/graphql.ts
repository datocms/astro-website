import { graphql } from '~/lib/datocms/graphql';

/** The continents of a partner, for the region counts of Partners. */
export const PartnersPartnerFragment = graphql(/* GraphQL */ `
  fragment PartnersPartnerFragment on PartnerRecord {
    locations {
      continent {
        id
        name
      }
    }
  }
`);
