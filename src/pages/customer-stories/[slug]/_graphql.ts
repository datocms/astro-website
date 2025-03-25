import { CodesandboxEmbedBlockFragment } from '~/components/blocks/CodesandboxEmbedBlock/graphql';
import { CtaButtonFragment } from '~/components/blocks/CtaButton/graphql';
import { DemoFragment } from '~/components/blocks/Demo/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { MultipleDemosBlockFragment } from '~/components/blocks/MultipleDemosBlock/graphql';
import { QuestionAnswerFragment } from '~/components/blocks/QuestionAnswer/graphql';
import { ShowcaseProjectBlockFragment } from '~/components/blocks/ShowcaseProjectBlock/graphql';
import { TableFragment } from '~/components/blocks/Table/graphql';
import { TutorialVideoFragment } from '~/components/blocks/TutorialVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { BlogPostInlineFragment } from '~/components/inlineRecords/BlogPostInline/graphql';
import { ChangelogEntryInlineFragment } from '~/components/inlineRecords/ChangelogEntryInline/graphql';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { BlogPostLinkFragment } from '~/components/linkToRecords/BlogPostLink/graphql';
import { ChangelogEntryLinkFragment } from '~/components/linkToRecords/ChangelogEntryLink/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  CustomerStoryUrlFragment,
  buildUrlForCustomerStory,
} from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      post: customerStory(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        seoH1
        canonicalUrl
        yoastAnalysis
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
            ...DemoFragment
            ...ImageFragment
            ...QuestionAnswerFragment
            ...MultipleDemosBlockFragment
            ...InternalVideoFragment
            ...VideoFragment
            ...CodesandboxEmbedBlockFragment
            ...CtaButtonFragment
            ...TutorialVideoFragment
            ...ShowcaseProjectBlockFragment
            ...TableFragment
          }
        }
        people {
          name
          title
          company
          avatar {
            responsiveImage(imgixParams: { auto: format, w: 50, h: 50, fit: crop, crop: faces }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    TableFragment,
    InternalVideoFragment,
    DemoFragment,
    MultipleDemosBlockFragment,
    VideoFragment,
    ImageFragment,
    TutorialVideoFragment,
    CodesandboxEmbedBlockFragment,
    CtaButtonFragment,
    ShowcaseProjectBlockFragment,
    QuestionAnswerFragment,
    BlogPostInlineFragment,
    ChangelogEntryInlineFragment,
    BlogPostLinkFragment,
    ChangelogEntryLinkFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allCustomerStories(first: 500) {
            ...CustomerStoryUrlFragment
          }
        }
      `,
      [CustomerStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForCustomerStory);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: customerStory(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
