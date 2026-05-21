import { ImageFragment } from '~/components/blocks/Image/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { DocCalloutFragment } from '~/components/docs/blocks/DocCallout/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { graphql } from '~/lib/datocms/graphql';

export const TabBlockFragment = graphql(
  /* GraphQL */ `
    fragment TabBlockFragment on TabBlockRecord {
      id
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
          ...VideoFragment
          ...DocCalloutFragment
        }
      }
    }
  `,
  [
    ImageFragment,
    VideoFragment,
    DocCalloutFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const TabsBlockFragment = graphql(
  /* GraphQL */ `
    fragment TabsBlockFragment on TabsBlockRecord {
      id
      tabs {
        ... on TabBlockRecord {
          ...TabBlockFragment
        }
      }
    }
  `,
  [TabBlockFragment],
);
