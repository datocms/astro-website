import { CopyPromptButtonFragment } from '~/components/StructuredText/blocks/CopyPromptButton';
import { ImageFragment } from '~/components/StructuredText/blocks/Image';
import { InternalVideoFragment } from '~/components/StructuredText/blocks/InternalVideo';
import { TabsBlockFragment } from '~/components/StructuredText/blocks/TabsBlock';
import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
import { graphql } from '~/lib/datocms/graphql';

/**
 * One entry of the changelog, with all its content, for its own page. The
 * content field of the changelog accepts only four blocks: CopyPromptButton,
 * Image, InternalVideo and TabsBlock.
 */
export const ProductUpdateFragment = graphql(
  /* GraphQL */ `
    fragment ProductUpdateFragment on ChangelogEntryRecord {
      title
      _firstPublishedAt
      categories {
        name
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

          ...CopyPromptButtonFragment
          ...ImageFragment
          ...InternalVideoFragment
          ...TabsBlockFragment
        }
      }
    }
  `,
  [
    CopyPromptButtonFragment,
    ImageFragment,
    InternalVideoFragment,
    TabsBlockFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);
