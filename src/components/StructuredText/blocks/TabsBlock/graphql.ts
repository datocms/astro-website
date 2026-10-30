import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
import { graphql } from '~/lib/datocms/graphql';
import { ImageFragment } from '../Image';
import { VideoFragment } from '../Video';
import { DocCalloutFragment } from './DocCallout';

// The schema permits only these three blocks in a tab.
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
        ...TabBlockFragment
      }
    }
  `,
  [TabBlockFragment],
);
