import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ResearchProgramPage {
      page: researchProgramPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        heroCtaLabel
        ctaUrl
        steps {
          ... on ProcessStepBlockRecord {
            id
            title
            body {
              value
            }
          }
        }
        faqs {
          ... on QuestionAnswerRecord {
            id
            question {
              value
            }
            answer {
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
            }
          }
        }
        bottomCtaButtonLabel
      }
    }
  `,
  [TagFragment, ...defaultLinkToRecordFragments, ...defaultInlineRecordFragments],
);
