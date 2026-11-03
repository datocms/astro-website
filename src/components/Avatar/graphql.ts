import { graphql } from '~/lib/datocms/graphql';

/** All the team members, with a square portrait cropped to the face. */
export const teamPhotosQuery = graphql(/* GraphQL */ `
  query TeamPhotos {
    members: allTeamMembers(first: 100) {
      id
      avatar {
        url(imgixParams: { w: 96, h: 96, fit: crop, crop: faces, auto: format })
      }
    }
  }
`);
