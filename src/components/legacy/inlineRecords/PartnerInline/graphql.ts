import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { graphql } from '~/lib/datocms/graphql';

export const PartnerInlineFragment = graphql(
  /* GraphQL */ `
    fragment PartnerInlineFragment on PartnerRecord {
      name
      ...PartnerUrlFragment
    }
  `,
  [PartnerUrlFragment],
);
