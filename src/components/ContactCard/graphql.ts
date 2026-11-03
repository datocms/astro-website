import { graphql } from '~/lib/datocms/graphql';

/** The team members behind the contact points, with a square portrait. */
export const contactPeopleQuery = graphql(/* GraphQL */ `
  query ContactPeople($ids: [ItemId]) {
    people: allTeamMembers(filter: { id: { in: $ids } }) {
      id
      name
      role
      avatar {
        url(imgixParams: { w: 80, h: 80, fit: crop, crop: faces, auto: format })
      }
    }
  }
`);
