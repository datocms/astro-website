import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const HintFragment = graphql(/* GraphQL */ `
  fragment HintFragment on PricingHintRecord @_unmask {
    apiId
    name
    description
    position
  }
`);

export const PlanFeatureGroupFragment = graphql(/* GraphQL */ `
  fragment PlanFeatureGroupFragment on PlanFeatureGroupRecord @_unmask {
    id
    name
    features {
      id
      name
      description {
        value
      }
      tags
      availableOnProfessionalPlan
    }
  }
`);

export const query = graphql(
  /* GraphQL */ `
    query Pricing {
      page: pricingPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      faqs: allFaqs {
        id
        question
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
      planFeatureGroups: allPlanFeatureGroups(orderBy: position_ASC, first: 100) {
        ...PlanFeatureGroupFragment
      }
      hints: allPricingHints(first: 500) {
        ...HintFragment
      }
      review1: review(filter: { name: { eq: "Tore Heimann" } }) {
        __typename
        ...ReviewQuoteFragment
      }
    }
  `,
  [
    ReviewQuoteFragment,
    TagFragment,
    HintFragment,
    PlanFeatureGroupFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);
