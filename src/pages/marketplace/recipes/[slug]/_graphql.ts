import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { MaybeVideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { buildUrlForRecipe, RecipeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/recipe';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query RecipeQuery($slug: String!) {
      page: recipe(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        cardDescription
        cardImage {
          responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        featuredImage {
          __typename
          ...MaybeVideoPlayerFragment
          responsiveImage(imgixParams: { w: 800, auto: format }) {
            ...ResponsiveImageFragment
          }
        }
        recipe {
          url
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
            ...InternalVideoFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    ImageFragment,
    InternalVideoFragment,
    MaybeVideoPlayerFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allRecipes(first: 100) {
            ...RecipeUrlFragment
            _updatedAt
          }
        }
      `,
      [RecipeUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(
    (entry): SitemapEntry => ({ url: buildUrlForRecipe(entry), lastmod: entry._updatedAt }),
  );
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: recipe(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
