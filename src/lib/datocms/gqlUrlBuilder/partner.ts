import { graphql, readFragment, type FragmentOf } from '../graphql';

export const PartnerUrlFragment = graphql(/* GraphQL */ `
  fragment PartnerUrlFragment on PartnerRecord {
    slug
  }
`);

export function buildUrlForPartner(partner: FragmentOf<typeof PartnerUrlFragment>) {
  const data = readFragment(PartnerUrlFragment, partner);
  return `/partners/${data.slug}`;
}
