import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';

export const ShowcaseProjectLinkFragment = graphql(
  /* GraphQL */ `
    fragment ShowcaseProjectLinkFragment on ShowcaseProjectRecord {
      ...ShowcaseProjectUrlFragment
    }
  `,
  [ShowcaseProjectUrlFragment],
);
