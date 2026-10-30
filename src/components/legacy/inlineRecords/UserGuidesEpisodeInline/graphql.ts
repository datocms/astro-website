import { UserGuidesEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';

export const UserGuidesEpisodeInlineFragment = graphql(
  /* GraphQL */ `
    fragment UserGuidesEpisodeInlineFragment on UserGuidesEpisodeRecord {
      title
      ...UserGuidesEpisodeUrlFragment
    }
  `,
  [UserGuidesEpisodeUrlFragment],
);
