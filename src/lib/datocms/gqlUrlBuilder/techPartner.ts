import { graphql, readFragment, type FragmentOf } from '../graphql';

export const TechPartnerUrlFragment = graphql(/* GraphQL */ `
  fragment TechPartnerUrlFragment on TechPartnerRecord {
    slug
  }
`);

export function buildUrlForTechPartner(techPartner: FragmentOf<typeof TechPartnerUrlFragment>) {
  const data = readFragment(TechPartnerUrlFragment, techPartner);
  return `/tech-partners/${data.slug}`;
}
