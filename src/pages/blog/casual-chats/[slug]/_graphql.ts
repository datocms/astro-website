import { ChatHeaderFragment } from '~/components/PostHeader';
import { CodesandboxEmbedBlockFragment } from '~/components/StructuredText/blocks/CodesandboxEmbedBlock';
import { CtaButtonFragment } from '~/components/StructuredText/blocks/CtaButton';
import { DemoFragment } from '~/components/StructuredText/blocks/Demo';
import { ImageFragment } from '~/components/StructuredText/blocks/Image';
import { InternalVideoFragment } from '~/components/StructuredText/blocks/InternalVideo';
import { MultipleDemosBlockFragment } from '~/components/StructuredText/blocks/MultipleDemosBlock';
import { QuestionAnswerFragment } from '~/components/StructuredText/blocks/QuestionAnswer';
import { ShowcaseProjectBlockFragment } from '~/components/StructuredText/blocks/ShowcaseProjectBlock';
import { TableFragment } from '~/components/StructuredText/blocks/Table';
import { TabsBlockFragment } from '~/components/StructuredText/blocks/TabsBlock';
import { TutorialVideoFragment } from '~/components/StructuredText/blocks/TutorialVideo';
import { VideoFragment } from '~/components/StructuredText/blocks/Video';
import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
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
    query ChatQuery($slug: String!) {
      chat: customerStory(filter: { slug: { eq: $slug } }) {
        ...ChatHeaderFragment
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        slug
        canonicalUrl
        yoastAnalysis
        _firstPublishedAt
        _publishedAt
        _createdAt
        people {
          name
        }
        # A casual chat has no CopyPromptButton and no ImageCarousel blocks.
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

            ...CodesandboxEmbedBlockFragment
            ...CtaButtonFragment
            ...DemoFragment
            ...ImageFragment
            ...InternalVideoFragment
            ...MultipleDemosBlockFragment
            ...QuestionAnswerFragment
            ...ShowcaseProjectBlockFragment
            ...TableFragment
            ...TabsBlockFragment
            ...TutorialVideoFragment
            ...VideoFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ChatHeaderFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
    // The CDA refuses a fragment on a block type that the schema does not
    // have. Thus this list has only the blocks of a casual chat.
    CodesandboxEmbedBlockFragment,
    CtaButtonFragment,
    DemoFragment,
    ImageFragment,
    InternalVideoFragment,
    MultipleDemosBlockFragment,
    QuestionAnswerFragment,
    ShowcaseProjectBlockFragment,
    TableFragment,
    TabsBlockFragment,
    TutorialVideoFragment,
    VideoFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allCustomerStories(first: 500) {
            _publishedAt
            ...CustomerStoryUrlFragment
          }
        }
      `,
      [CustomerStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForCustomerStory(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
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
