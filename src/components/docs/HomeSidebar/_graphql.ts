import { DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query HomeSidebar {
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          __typename
          ...DocGroupUrlFragment
        }
      }
    }
  `,
  [DocGroupUrlFragment],
);
