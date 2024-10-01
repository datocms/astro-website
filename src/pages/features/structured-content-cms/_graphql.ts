import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query StructuredContentCms($slug: String!) {
      page: feature(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
      }
      integrations: allIntegrations(first: 100) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
    }
  `,
  [TagFragment],
);
