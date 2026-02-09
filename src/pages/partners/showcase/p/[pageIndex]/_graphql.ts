import { range } from 'lodash-es';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const perPage = 36;

export const query = graphql(
  /* GraphQL */ `
    query ProjectsShowcase {
      projects: allShowcaseProjects(
        first: 500
        orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]
      ) {
        ...ShowcaseProjectUrlFragment
        id
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
          logo {
            url
            alt
          }
          areasOfExpertise {
            name
          }
        }
        technologies {
          name
        }
      }
    }
  `,
  [ResponsiveImageFragment, ShowcaseProjectUrlFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
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
    executeQueryOptions,
  );

  return range(2, 1 + Math.ceil(count / perPage)).map(
    (i): SitemapEntry => ({ url: `/partners/showcase/p/${i}` }),
  );
};
