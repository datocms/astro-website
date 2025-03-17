import { graphql, readFragment, type FragmentOf } from '../graphql';

export const UserGuidesChapterUrlFragment = graphql(/* GraphQL */ `
  fragment UserGuidesChapterUrlFragment on UserGuidesChapterRecord {
    slug
    videos {
      slug
    }
  }
`);

export function buildUrlForUserGuidesChapter(
  userGuidesChapter: FragmentOf<typeof UserGuidesChapterUrlFragment>,
) {
  const data = readFragment(UserGuidesChapterUrlFragment, userGuidesChapter);
  return `/user-guides/${data.slug}/${data.videos[0]!.slug}`;
}
