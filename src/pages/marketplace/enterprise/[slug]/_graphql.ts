import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  EnterpriseAppUrlFragment,
  buildUrlForEnterpriseApp,
} from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query EnterpriseAppQuery($slug: String!) {
      page: enterpriseApp(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        description
        shortDescription
        logo {
          url
          alt
          width
          height
        }
        gallery {
          id
          responsiveImage(imgixParams: { auto: format, w: 1200, h: 800, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        content {
          value
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ...AcademyChapterLinkFragment
            ...AcademyCourseLinkFragment
            ...BlogPostLinkFragment
            ...ChangelogEntryLinkFragment
            ...CustomerStoryLinkFragment
            ...DocGroupLinkFragment
            ...DocPageLinkFragment
            ...EnterpriseAppLinkFragment
            ...FeatureLinkFragment
            ...HostingAppLinkFragment
            ...LandingPageLinkFragment
            ...PartnerLinkFragment
            ...PluginLinkFragment
            ...ProductComparisonLinkFragment
            ...RecipeLinkFragment
            ...ShowcaseProjectLinkFragment
            ...SuccessStoryLinkFragment
            ...TechPartnerLinkFragment
            ...TemplateDemoLinkFragment
            ...UseCasePageLinkFragment
            ...UserGuidesEpisodeLinkFragment

            ...AcademyChapterInlineFragment
            ...AcademyCourseInlineFragment
            ...BlogPostInlineFragment
            ...ChangelogEntryInlineFragment
            ...CustomerStoryInlineFragment
            ...DocGroupInlineFragment
            ...DocPageInlineFragment
            ...EnterpriseAppInlineFragment
            ...FeatureInlineFragment
            ...HostingAppInlineFragment
            ...LandingPageInlineFragment
            ...PartnerInlineFragment
            ...PluginInlineFragment
            ...ProductComparisonInlineFragment
            ...RecipeInlineFragment
            ...ShowcaseProjectInlineFragment
            ...SuccessStoryInlineFragment
            ...TechPartnerInlineFragment
            ...TemplateDemoInlineFragment
            ...UseCasePageInlineFragment
            ...UserGuidesEpisodeInlineFragment
          }
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ...ImageFragment
            ...VideoFragment
            ...InternalVideoFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    ImageFragment,
    VideoFragment,
    InternalVideoFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allEnterpriseApps(first: 100) {
            ...EnterpriseAppUrlFragment
            _updatedAt
          }
        }
      `,
      [EnterpriseAppUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(
    (entry): SitemapEntry => ({ url: buildUrlForEnterpriseApp(entry), lastmod: entry._updatedAt }),
  );
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: enterpriseApp(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
