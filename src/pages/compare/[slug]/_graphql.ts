import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  ProductComparisonUrlFragment,
  buildUrlForProductComparison,
} from '~/lib/datocms/gqlUrlBuilder/productComparison';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query Compare($slug: String!) {
      page: productComparison(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        product
        datocmsCharacterization {
          value
        }
        competitorCharacterization {
          value
        }
        testimonials {
          __typename
          ...PartnerTestimonialQuoteFragment
          ...ReviewQuoteFragment
        }
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
        reasons {
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
          }
        }
        importer {
          learnMoreSlug
          header
          description
        }
      }
    }
  `,
  [
    TagFragment,
    PartnerTestimonialQuoteFragment,
    ReviewQuoteFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allProductComparisons(first: 500) {
            ...ProductComparisonUrlFragment
            _updatedAt
          }
        }
      `,
      [ProductComparisonUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(
    (entry): SitemapEntry => ({
      url: buildUrlForProductComparison(entry),
      lastmod: entry._updatedAt,
    }),
  );
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: productComparison(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
