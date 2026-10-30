import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { graphql } from '~/lib/datocms/graphql';

export const DocPageLinkFragment = graphql(
  /* GraphQL */ `
    fragment DocPageLinkFragment on DocPageRecord {
      ...DocPageUrlFragment
    }
  `,
  [DocPageUrlFragment],
);
