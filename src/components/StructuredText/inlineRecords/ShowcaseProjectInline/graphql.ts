import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';

export const ShowcaseProjectInlineFragment = graphql(
  /* GraphQL */ `
    fragment ShowcaseProjectInlineFragment on ShowcaseProjectRecord {
      name
      ...ShowcaseProjectUrlFragment
    }
  `,
  [ShowcaseProjectUrlFragment],
);
