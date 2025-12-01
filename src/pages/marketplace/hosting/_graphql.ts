import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Enterprise {
      items: allHostingApps(first: 100) {
        ...HostingAppUrlFragment
        slug
        title
        description: shortDescription
        logo {
          url
          alt
          width
          height
        }
      }
    }
  `,
  [HostingAppUrlFragment],
);
