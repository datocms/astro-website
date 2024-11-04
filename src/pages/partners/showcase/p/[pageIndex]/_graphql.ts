import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
// import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ProjectsShowcase($limit: IntType!, $offset: IntType!) {
      projects: allShowcaseProjects(
        first: $limit
        skip: $offset
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...ShowcaseProjectUrlFragment
        headline {
          value
        }
        mainImage {
          responsiveImage(imgixParams: { auto: format, w: 750, h: 500, fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
        partner {
          name
          slug
          logo {
            url
          }
        }
      }
      _allShowcaseProjectsMeta {
        count
      }
    }
  `,
  [ResponsiveImageFragment, ShowcaseProjectUrlFragment],
);
