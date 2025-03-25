import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { TableFragment } from '~/components/blocks/Table/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  AcademyChapterUrlFragment,
  buildUrlForAcademyChapter,
} from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query AcademyChapter($courseSlug: String!, $chapterSlug: String!) {
      chapter: academyChapter(filter: { slug: { eq: $chapterSlug } }) {
        id
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
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
            ...InternalVideoFragment
            ...TableFragment
          }
        }
        matchingCourses: _allReferencingAcademyCourses(filter: { slug: { eq: $courseSlug } }) {
          name
          introduction {
            value
          }
          chapters {
            ...AcademyChapterUrlFragment
            id
            title
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ImageFragment,
    InternalVideoFragment,
    TableFragment,
    AcademyChapterUrlFragment,
    ResponsiveImageFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allAcademyChapters(first: 500) {
            ...AcademyChapterUrlFragment
          }
        }
      `,
      [AcademyChapterUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForAcademyChapter);
};

export const paramsToRecordId: ParamsToRecordIdFn<{
  courseSlug: string;
  chapterSlug: string;
}> = async ({ executeQueryOptions, params: { courseSlug, chapterSlug } }) => {
  const { chapter, course } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($courseSlug: String!, $chapterSlug: String!) {
        chapter: academyChapter(filter: { slug: { eq: $chapterSlug } }) {
          id
        }
        course: academyCourse(filter: { slug: { eq: $courseSlug } }) {
          id
          chapters {
            id
          }
        }
      }
    `),
    { ...executeQueryOptions, variables: { courseSlug, chapterSlug } },
  );

  if (chapter && course && course.chapters.map((c) => c.id).includes(chapter.id)) {
    return chapter.id;
  }
};
