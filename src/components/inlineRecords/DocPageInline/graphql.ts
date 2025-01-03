import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { graphql } from '~/lib/datocms/graphql';

export const DocPageInlineFragment = graphql(
  /* GraphQL */ `
    fragment DocPageInlineFragment on DocPageRecord {
      title
      ...DocPageUrlFragment
    }
  `,
  [DocPageUrlFragment],
);
