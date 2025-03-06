import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { buildUrlForPartner, PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import { PluginCardFragment } from '~/pages/marketplace/_sub/PluginCard/_graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query PartnerQuery($partnerSlug: String!) {
      page: partner(filter: { slug: { eq: $partnerSlug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        id
        name
        shortDescription {
          value
        }
        logo {
          url
          pngUrl: url(imgixParams: { fm: png, h: 200 })
        }
        description {
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
        publicContactEmail
        websiteUrl
        areasOfExpertise {
          name
        }
        technologies {
          name
        }
        locations {
          name
          emoji
          continent {
            name
          }
        }
        npmUser {
          id
        }
        featuredProjects {
          id
        }
        projects: _allReferencingShowcaseProjects(first: 100, orderBy: _firstPublishedAt_DESC) {
          ...ShowcaseProjectUrlFragment
          id
          name
          headline {
            value
          }
          technologies {
            name
            integrationType {
              slug
            }
            logo {
              url
            }
          }
          mainImage {
            responsiveImage(imgixParams: { auto: format, w: 750, h: 500, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    ShowcaseProjectUrlFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const extraQuery = graphql(
  /* GraphQL */ `
    query PartnerExtraQuery($authorId: ItemId!) {
      plugins: allPlugins(
        filter: { author: { eq: $authorId }, manuallyDeprecated: { eq: false } }
        orderBy: installs_DESC
      ) {
        ...PluginCardFragment
      }
    }
  `,
  [ResponsiveImageFragment, PluginCardFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allPartners(first: 500) {
            ...PartnerUrlFragment
          }
        }
      `,
      [PartnerUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForPartner);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ partnerSlug: string }> = async ({
  executeQueryOptions,
  params: { partnerSlug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($partnerSlug: String!) {
        entity: partner(filter: { slug: { eq: $partnerSlug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { partnerSlug } },
  );

  return entity?.id;
};
