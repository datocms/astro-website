import { LandingPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/landingPage';
import { graphql } from '~/lib/datocms/graphql';

export const LandingPageInlineFragment = graphql(
  /* GraphQL */ `
    fragment LandingPageInlineFragment on LandingPageRecord {
      name
      ...LandingPageUrlFragment
    }
  `,
  [LandingPageUrlFragment],
);
