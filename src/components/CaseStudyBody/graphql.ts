import { ImageFragment } from '~/components/StructuredText/blocks/Image';
import { InDepthCtaBlockFragment } from '~/components/StructuredText/blocks/InDepthCtaBlock';
import { InternalVideoFragment } from '~/components/StructuredText/blocks/InternalVideo';
import { VideoFragment } from '~/components/StructuredText/blocks/Video';
import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';

/**
 * The full story of a success story, and the facts next to it. The content
 * field accepts four blocks: Image, Video, InternalVideo and InDepthCtaBlock.
 */
export const CaseStudyBodyStoryFragment = graphql(
  /* GraphQL */ `
    fragment CaseStudyBodyStoryFragment on SuccessStoryRecord {
      projectUrl
      industry {
        name
      }
      useCase {
        navigationBarTitle
        ...UseCasePageUrlFragment
      }
      tags {
        name
      }
      keyFeatures {
        ... on FeatureRecord {
          seoH1
          ...FeatureUrlFragment
        }
      }
      partner {
        name
        ...PartnerUrlFragment
      }
      content {
        value
        blocks {
          ... on RecordInterface {
            id
            __typename
          }

          ...ImageFragment
          ...VideoFragment
          ...InternalVideoFragment
          ...InDepthCtaBlockFragment
        }
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
    }
  `,
  [
    ImageFragment,
    VideoFragment,
    InternalVideoFragment,
    InDepthCtaBlockFragment,
    UseCasePageUrlFragment,
    FeatureUrlFragment,
    PartnerUrlFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);
