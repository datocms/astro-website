import { graphql } from '~/lib/datocms/graphql';
import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';

export const DocCardFragment = graphql(
  /* GraphQL */ `
    fragment DocCardFragment on DocsHomeDocCardBlockRecord {
      id
      overrideTitle
      description
      badge
      target {
        __typename
        ... on DocGroupRecord {
          name
          ...DocGroupUrlFragment
        }
        ... on DocPageRecord {
          title
          ...DocPageUrlFragment
        }
      }
    }
  `,
  [DocGroupUrlFragment, DocPageUrlFragment],
);
