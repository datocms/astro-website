import { graphql, readFragment, type FragmentOf } from '../graphql';

export const LandingPageUrlFragment = graphql(/* GraphQL */ `
  fragment LandingPageUrlFragment on LandingPageRecord {
    slug
  }
`);

export function buildUrlForLandingPage(landingPage: FragmentOf<typeof LandingPageUrlFragment>) {
  const data = readFragment(LandingPageUrlFragment, landingPage);
  return `/cms/${data.slug}`;
}
