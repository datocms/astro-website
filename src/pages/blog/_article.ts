import { ChatHeaderFragment, PostHeaderFragment } from '~/components/PostHeader';
import { defaultBlockFragments } from '~/components/StructuredText/blocks';
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
import { graphql } from '~/lib/datocms/graphql';

/*
 * The data of _ArticlePage. Two fragments, not one fragment on
 * RecordInterface: the content field of each model has a different type.
 *
 * Each fragment selects __typename. _ArticlePage reads the fragment from a
 * record with a __typename, and readFragment then requires the result of the
 * fragment to have the same __typename: without it, the result is never.
 */

/** A blog post. */
export const ArticlePostFragment = graphql(
  /* GraphQL */ `
    fragment ArticlePostFragment on BlogPostRecord {
      __typename
      ...PostHeaderFragment
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
      author {
        name
      }
      category {
        name
        slug
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

          ...CodesandboxEmbedBlockFragment
          ...CopyPromptButtonFragment
          ...CtaButtonFragment
          ...DemoFragment
          ...ImageFragment
          ...ImageCarouselFragment
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
  `,
  [
    TagFragment,
    PostHeaderFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
    ...defaultBlockFragments,
  ],
);

/** A casual chat: the model CustomerStory. */
export const ArticleChatFragment = graphql(
  /* GraphQL */ `
    fragment ArticleChatFragment on CustomerStoryRecord {
      __typename
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
