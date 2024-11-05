import { range } from 'lodash-es';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
// import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const perPage = 36;

export const query = graphql(
  /* GraphQL */ `
    query ProjectsShowcase($limit: IntType!, $offset: IntType!) {
      projects: allShowcaseProjects(
        first: $limit
        skip: $offset
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...ShowcaseProjectUrlFragment
        name
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

export const buildSitemapUrls = async () => {
  const {
    meta: { count },
  } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query BuildSitemapUrls {
        meta: _allShowcaseProjectsMeta {
          count
        }
      }
    `),
  );

  return range(2, 2 + Math.ceil(count / perPage)).map((i) => `/partners/showcase/p/${i}`);
};
