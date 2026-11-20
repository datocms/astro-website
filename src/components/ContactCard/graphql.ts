import { graphql } from '~/lib/datocms/graphql';

/**
 * The team members that belong to a department, with a square portrait
 * cropped at the focal point. A contact point is the slug of a department.
 */
export const contactPeopleQuery = graphql(/* GraphQL */ `
  query ContactPeople {
    people: allTeamMembers(first: 100, filter: { departments: { exists: true } }) {
      name
      role
      avatar {
        url(imgixParams: { w: 80, h: 80, fit: crop, auto: format })
      }
      # The photo of the OG card: a JPEG, because the card cannot read
      # the formats that auto: format gives.
      ogPhoto: avatar {
        url(imgixParams: { w: 400, h: 400, fit: crop, fm: jpg })
      }
      departments {
        slug
        name
      }
    }
  }
`);
