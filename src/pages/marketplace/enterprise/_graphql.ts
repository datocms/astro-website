import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Enterprise {
      items: allEnterpriseApps(first: 100) {
        ...EnterpriseAppUrlFragment
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
  [EnterpriseAppUrlFragment],
);
