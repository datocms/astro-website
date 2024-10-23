import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

export const ChangelogEntryLinkFragment = graphql(
  /* GraphQL */ `
    fragment ChangelogEntryLinkFragment on ChangelogEntryRecord {
      ... on ChangelogEntryRecord {
        title
        ...ChangelogEntryUrlFragment
      }
    }
  `,
  [ChangelogEntryUrlFragment],
);
