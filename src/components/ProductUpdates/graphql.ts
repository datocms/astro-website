import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

/** One row of ProductUpdates: an entry of the changelog. */
export const ProductUpdatesItemFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdatesItemFragment on ChangelogEntryRecord {
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
