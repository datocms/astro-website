import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

/** One row of the index: the entry without its content. */
export const ProductUpdateListFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateListFragment on ChangelogEntryRecord {
      id
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
