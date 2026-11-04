import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
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
            alt
            width
            height
            pngUrl: url(imgixParams: { fm: png, h: 200 })
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
        }
        technologies {
          name
        }
        areasOfExpertise {
          name
        }
        mainImage {
          responsiveImage(imgixParams: { w: 960 }) {
            ...ResponsiveImageFragment
          }
          pixelSrc: url(imgixParams: { w: 480, fm: jpg })
          thumbhash
        }
        video {
          ...VideoPlayerFragment
          video {
            thumbhash
          }
        }
        projectScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { w: 1200 }) {
            ...ResponsiveImageFragment
          }
          lightboxImageUrl: url(imgixParams: { w: 2000, fit: max })
        }
        datocmsScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { w: 1200 }) {
            ...ResponsiveImageFragment
          }
          lightboxImageUrl: url(imgixParams: { w: 2000, fit: max })
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
            _publishedAt
            ...ShowcaseProjectUrlFragment
          }
        }
      `,
      [ShowcaseProjectUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForShowcaseProject(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
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
