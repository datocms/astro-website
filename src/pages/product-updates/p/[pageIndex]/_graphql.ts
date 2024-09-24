import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const PostFragment = graphql(/* GraphQL */ `
  fragment PostFragment on ChangelogEntryRecord {
    id
    title
    slug
    content {
      value
    }
  }
`);

export const query = graphql(
  /* GraphQL */ `
    query ProductUpdates($limit: IntType!, $offset: IntType!) {
      page: changelog {
        _seoMetaTags {
          ...TagFragment
        }
      }
      posts: allChangelogEntries(first: $limit, skip: $offset, orderBy: _firstPublishedAt_DESC) {
        ...PostFragment
      }
      _allChangelogEntriesMeta {
        count
      }
    }
  `,
  [TagFragment, PostFragment],
);
