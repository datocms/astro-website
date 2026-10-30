import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { graphql } from '~/lib/datocms/graphql';

export const DocGroupInlineFragment = graphql(
  /* GraphQL */ `
    fragment DocGroupInlineFragment on DocGroupRecord {
      name
      ...DocGroupUrlFragment
    }
  `,
  [DocGroupUrlFragment],
);
