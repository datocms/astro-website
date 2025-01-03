import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { graphql } from '~/lib/datocms/graphql';

export const DocGroupLinkFragment = graphql(
  /* GraphQL */ `
    fragment DocGroupLinkFragment on DocGroupRecord {
      ...DocGroupUrlFragment
    }
  `,
  [DocGroupUrlFragment],
);
