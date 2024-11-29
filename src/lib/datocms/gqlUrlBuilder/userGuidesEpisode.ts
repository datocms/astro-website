import { graphql, readFragment, type FragmentOf } from '../graphql';

export const UserGuidesEpisodeUrlFragment = graphql(/* GraphQL */ `
  fragment UserGuidesEpisodeUrlFragment on UserGuidesEpisodeRecord {
    slug
    chapters: _allReferencingUserGuidesChapters {
      slug
    }
  }
`);

export function buildUrlForUserGuidesEpisode(
  userGuidesEpisode: FragmentOf<typeof UserGuidesEpisodeUrlFragment>,
) {
  const data = readFragment(UserGuidesEpisodeUrlFragment, userGuidesEpisode);
  return `/user-guides/${data.chapters[0]!.slug}/${data.slug}`;
}
