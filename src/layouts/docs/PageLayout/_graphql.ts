import { CopyPromptButtonFragment } from '~/components/docs/blocks/CopyPromptButton/graphql';
import { DemoFragment } from '~/components/docs/blocks/Demo/graphql';
import { GithubNpmBadgeFragment } from '~/components/docs/blocks/GithubNpmBadge/graphql';
import { ImageFragment } from '~/components/docs/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/docs/blocks/InternalVideo/graphql';
import { MultipleDemosBlockFragment } from '~/components/docs/blocks/MultipleDemosBlock/graphql';
import { TableFragment } from '~/components/docs/blocks/Table/graphql';
import { TabsBlockFragment } from '~/components/docs/blocks/TabsBlock/graphql';
import { TutorialVideoFragment } from '~/components/docs/blocks/TutorialVideo/graphql';
import { CloneButtonFormFragment } from '~/components/docs/blocks/CloneButtonForm/graphql';
import { DeployButtonFormFragment } from '~/components/docs/blocks/DeployButtonForm/graphql';
import { DocCalloutFragment } from '~/components/docs/blocks/DocCallout/graphql';
import { PluginSdkHookGroupFragment } from '~/components/docs/blocks/PluginSdkHookGroup/graphql';
import { ReactUiLiveExampleFragment } from '~/components/docs/blocks/ReactUiLiveExample/graphql';
import { defaultInlineRecordFragments } from '~/components/docs/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/docs/linkToRecords';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
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
