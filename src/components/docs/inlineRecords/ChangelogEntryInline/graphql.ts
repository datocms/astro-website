import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

export const ChangelogEntryInlineFragment = graphql(
  /* GraphQL */ `
    fragment ChangelogEntryInlineFragment on ChangelogEntryRecord {
      title
      ...ChangelogEntryUrlFragment
    }
  `,
  [ChangelogEntryUrlFragment],
);
