import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  TemplateDemoUrlFragment,
  buildUrlForTemplateDemo,
} from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query StarterQuery($slug: String!) {
      page: templateDemo(filter: { code: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        cmsDescription
        seoH1
        yoastAnalysis
        readme
        _firstPublishedAt
        code
        githubRepo
        technology {
          name
          logo {
            url
            width
            height
          }
        }
        screenshot {
          ogImageUrl: url(imgixParams: { auto: format, w: 1200, h: 800, fit: crop, crop: top })
          responsiveImage(imgixParams: { auto: format, w: 600, h: 500, fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
        backendScreenshot {
          responsiveImage(imgixParams: { auto: format, h: 500, fit: crop, crop: top }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allTemplateDemos(first: 100) {
            ...TemplateDemoUrlFragment
          }
        }
      `,
      [TemplateDemoUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForTemplateDemo);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: templateDemo(filter: { code: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
