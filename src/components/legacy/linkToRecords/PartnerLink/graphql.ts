import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

export const PartnerLinkFragment = graphql(
  /* GraphQL */ `
    fragment PartnerLinkFragment on PartnerRecord {
      ...PartnerUrlFragment
    }
  `,
  [PartnerUrlFragment],
);
