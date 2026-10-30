import { CopyPromptButtonFragment } from '~/components/legacy/blocks/CopyPromptButton/graphql';
import { DemoFragment } from '~/components/legacy/blocks/Demo/graphql';
import { GithubNpmBadgeFragment } from '~/components/legacy/blocks/GithubNpmBadge/graphql';
import { ImageFragment } from '~/components/legacy/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/legacy/blocks/InternalVideo/graphql';
import { MultipleDemosBlockFragment } from '~/components/legacy/blocks/MultipleDemosBlock/graphql';
import { TableFragment } from '~/components/legacy/blocks/Table/graphql';
import { TabsBlockFragment } from '~/components/legacy/blocks/TabsBlock/graphql';
import { TutorialVideoFragment } from '~/components/legacy/blocks/TutorialVideo/graphql';
import { CloneButtonFormFragment } from '~/components/legacy/docs/blocks/CloneButtonForm/graphql';
import { DeployButtonFormFragment } from '~/components/legacy/docs/blocks/DeployButtonForm/graphql';
import { DocCalloutFragment } from '~/components/legacy/docs/blocks/DocCallout/graphql';
import { PluginSdkHookGroupFragment } from '~/components/legacy/docs/blocks/PluginSdkHookGroup/graphql';
import { ReactUiLiveExampleFragment } from '~/components/legacy/docs/blocks/ReactUiLiveExample/graphql';
import { defaultInlineRecordFragments } from '~/components/legacy/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/legacy/linkToRecords';
import { ResponsiveImageFragment } from '~/components/legacy/LegacyResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { GroupLayoutFragment } from '../GroupLayout/_graphql';

export const PageLayoutFragment = graphql(
  /* GraphQL */ `
    fragment PageLayoutFragment on DocPageRecord {
      id
      title
      _publishedAt
      _seoMetaTags {
        ...TagFragment
      }
      seo {
        title
        description
      }
      parents: _allReferencingDocGroups {
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
          ...ImageFragment
          ...TableFragment
          ...TabsBlockFragment
          ...DemoFragment
          ...MultipleDemosBlockFragment
          ...InternalVideoFragment
          ...CloneButtonFormFragment
          ...DeployButtonFormFragment
          ...PluginSdkHookGroupFragment
          ...DocCalloutFragment
          ...GithubNpmBadgeFragment
          ...ReactUiLiveExampleFragment
          ...TutorialVideoFragment
          ...CopyPromptButtonFragment
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    ImageFragment,
    TableFragment,
    TabsBlockFragment,
    DemoFragment,
    MultipleDemosBlockFragment,
    InternalVideoFragment,
    CloneButtonFormFragment,
    DeployButtonFormFragment,
    PluginSdkHookGroupFragment,
    DocCalloutFragment,
    GithubNpmBadgeFragment,
    ReactUiLiveExampleFragment,
    TutorialVideoFragment,
    CopyPromptButtonFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const docGroupQuery = graphql(
  /* GraphQL */ `
    query DocPageGroup($groupSlug: String!) {
      group: docGroup(filter: { slug: { eq: $groupSlug } }) {
        ...GroupLayoutFragment
        pagesOrSections: pages {
          __typename
          ... on DocGroupPageRecord {
            page {
              id
              slug
            }
          }
          ... on DocGroupSectionRecord {
            title
            pages {
              page {
                id
                slug
              }
            }
          }
        }
      }
    }
  `,
  [GroupLayoutFragment],
);

export const docPageQuery = graphql(
  /* GraphQL */ `
    query DocPagePage($pageId: ItemId!) {
      page: docPage(filter: { id: { eq: $pageId } }) {
        ...PageLayoutFragment
      }
    }
  `,
  [PageLayoutFragment],
);
