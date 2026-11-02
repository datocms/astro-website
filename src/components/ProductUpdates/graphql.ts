import { ProductUpdateRowFragment } from '~/components/ProductUpdateRow';
import { graphql } from '~/lib/datocms/graphql';

/** One row of ProductUpdates: an entry of the changelog. */
export const ProductUpdatesItemFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdatesItemFragment on ChangelogEntryRecord {
      ...ProductUpdateRowFragment
    }
  `,
  [ProductUpdateRowFragment],
);
