import { TechPartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/techPartner';
import { graphql } from '~/lib/datocms/graphql';

export const TechPartnerLinkFragment = graphql(
  /* GraphQL */ `
    fragment TechPartnerLinkFragment on TechPartnerRecord {
      ...TechPartnerUrlFragment
    }
  `,
  [TechPartnerUrlFragment],
);
