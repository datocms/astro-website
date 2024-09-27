import { graphql, readFragment, type FragmentOf } from '../graphql';

export const UserGuideEpisodeUrlFragment = graphql(/* GraphQL */ `
  fragment UserGuideEpisodeUrlFragment on UserGuidesVideoRecord {
    slug
    chapters: _allReferencingUserGuidesChapters {
      slug
    }
  }
`);

export function buildUrlForUserGuideEpisode(
  userGuideEpisode: FragmentOf<typeof UserGuideEpisodeUrlFragment>,
) {
  const data = readFragment(UserGuideEpisodeUrlFragment, userGuideEpisode);
  return `/user-guides/${data.chapters[0]!.slug}/${data.slug}`;
}
