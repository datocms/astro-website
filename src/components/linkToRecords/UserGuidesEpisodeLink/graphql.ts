import { UserGuidesEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';

export const UserGuidesEpisodeLinkFragment = graphql(
  /* GraphQL */ `
    fragment UserGuidesEpisodeLinkFragment on UserGuidesEpisodeRecord {
      ...UserGuidesEpisodeUrlFragment
    }
  `,
  [UserGuidesEpisodeUrlFragment],
);
