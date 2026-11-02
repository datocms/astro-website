import { ProductUpdateRowFragment } from '~/components/ProductUpdateRow';
import { graphql } from '~/lib/datocms/graphql';

/** One row of the index: the entry without its content, and its date for the month groups. */
export const ProductUpdateListFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateListFragment on ChangelogEntryRecord {
      _firstPublishedAt
      ...ProductUpdateRowFragment
    }
  `,
  [ProductUpdateRowFragment],
);
