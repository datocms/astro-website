import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

/** One row of a list of changelog entries: the entry without its content. */
export const ProductUpdateRowFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateRowFragment on ChangelogEntryRecord {
      title
      _firstPublishedAt
      categories {
        name
      }
      ...ChangelogEntryUrlFragment
    }
  `,
  [ChangelogEntryUrlFragment],
);
