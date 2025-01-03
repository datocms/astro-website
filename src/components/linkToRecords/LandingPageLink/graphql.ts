import { LandingPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/landingPage';
import { graphql } from '~/lib/datocms/graphql';

export const LandingPageLinkFragment = graphql(
  /* GraphQL */ `
    fragment LandingPageLinkFragment on LandingPageRecord {
      ...LandingPageUrlFragment
    }
  `,
  [LandingPageUrlFragment],
);
