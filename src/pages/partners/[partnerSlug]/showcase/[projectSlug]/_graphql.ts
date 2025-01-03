import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import {
  buildUrlForShowcaseProject,
  ShowcaseProjectUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query ShowcaseQuery($projectSlug: String!) {
      page: showcaseProject(filter: { slug: { eq: $projectSlug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        partner {
          ...PartnerUrlFragment
          name
          logo {
            url
          }
          shortDescription {
            value
          }
        }
        name
        projectUrl
        headline {
          value
        }
        inDepthExplanation {
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
            ...ShowcaseProjectInlineFragment
            ...SuccessStoryInlineFragment
            ...TechPartnerInlineFragment
            ...TemplateDemoInlineFragment
            ...UseCasePageInlineFragment
            ...UserGuidesEpisodeInlineFragment
          }
        }
        technologies {
          name
          logo {
            url
          }
        }
        areasOfExpertise {
          name
        }
        mainImage {
          responsiveImage(imgixParams: { auto: format, w: 1600 }) {
            ...ResponsiveImageFragment
          }
        }
        video {
          ...VideoPlayerFragment
        }
        projectScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { auto: format, w: 1200 }) {
            ...ResponsiveImageFragment
          }
          lightboxImageUrl: url(imgixParams: { auto: format, w: 2000, fit: max })
        }
        datocmsScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { auto: format, w: 1200 }) {
            ...ResponsiveImageFragment
          }
          lightboxImageUrl: url(imgixParams: { auto: format, w: 2000, fit: max })
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    PartnerUrlFragment,
    VideoPlayerFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allShowcaseProjects(first: 500) {
            ...ShowcaseProjectUrlFragment
          }
        }
      `,
      [ShowcaseProjectUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForShowcaseProject);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ projectSlug: string }> = async ({
  executeQueryOptions,
  params: { projectSlug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($projectSlug: String!) {
        entity: showcaseProject(filter: { slug: { eq: $projectSlug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { projectSlug } },
  );

  return entity?.id;
};
