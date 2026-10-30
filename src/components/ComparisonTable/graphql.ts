import { defaultInlineRecordFragments } from '~/components/StructuredText/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/StructuredText/linkToRecords';
import { ProductComparisonUrlFragment } from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';

/**
 * The comparison of the page: the topics, and for each topic the
 * differences between DatoCMS and the competitor.
 */
export const ComparisonTableComparisonFragment = graphql(
  /* GraphQL */ `
    fragment ComparisonTableComparisonFragment on ProductComparisonRecord {
      id
      product
      topics {
        id
        topic
        differences {
          id
          datocmsTake {
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
          competitorTake {
            value
          }
        }
      }
    }
  `,
  [...defaultLinkToRecordFragments, ...defaultInlineRecordFragments],
);

/** A comparison in the list of the header: the other competitors. */
export const ComparisonTableAlternativeFragment = graphql(
  /* GraphQL */ `
    fragment ComparisonTableAlternativeFragment on ProductComparisonRecord {
      id
      product
      ...ProductComparisonUrlFragment
    }
  `,
  [ProductComparisonUrlFragment],
);
