import { graphql } from '~/lib/datocms/graphql';

/**
 * All the team members, with a square portrait. `fit: crop` crops at the focal
 * point of the photo. Do not add `crop: faces`: it ignores the focal point, and
 * a photo with two faces can show the wrong person.
 */
export const teamPhotosQuery = graphql(/* GraphQL */ `
  query TeamPhotos {
    members: allTeamMembers(first: 100) {
      id
      avatar {
        url(imgixParams: { w: 96, h: 96, fit: crop, auto: format })
      }
    }
  }
`);
