import { TechPartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/techPartner';
import { graphql } from '~/lib/datocms/graphql';

export const TechPartnerInlineFragment = graphql(
  /* GraphQL */ `
    fragment TechPartnerInlineFragment on TechPartnerRecord {
      name
      ...TechPartnerUrlFragment
    }
  `,
  [TechPartnerUrlFragment],
);
