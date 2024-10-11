import { graphql, readFragment, type FragmentOf } from '../graphql';

export const ChangelogEntryUrlFragment = graphql(/* GraphQL */ `
  fragment ChangelogEntryUrlFragment on ChangelogEntryRecord {
    slug
  }
`);

export function buildUrlForChangelogEntry(
  changelogEntry: FragmentOf<typeof ChangelogEntryUrlFragment>,
) {
  const data = readFragment(ChangelogEntryUrlFragment, changelogEntry);
  return `/marketplace/plugins/i/${data.slug}`;
}
