import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InDepthCtaBlockFragment } from '~/components/blocks/InDepthCtaBlock/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForSuccessStory,
  SuccessStoryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';

export const query = graphql(
  /* GraphQL */ `
    query PostQuery($slug: String!) {
      page: successStory(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        name
        position
        title {
          value
        }
        subtitle {
          value
        }
        coverImage {
          url
          responsiveImage(imgixParams: { auto: format, ar: "3:2", w: 1200, fit: crop }) {
            ...ResponsiveImageFragment
          }
          focalPoint {
            x
            y
          }
        }
        logo {
          url
        }
        challenge {
          value
        }
        result {
          value
        }
        numbers {
          number
          label
        }
        mainResultsImage {
          url
          responsiveImage(imgixParams: { auto: format, w: 1000, h: 660, fit: crop }) {
            ...ResponsiveImageFragment
          }
          focalPoint {
            x
            y
          }
        }
        mainResults {
          title
          description {
            value
          }
        }
        projectUrl
        useCase {
          navigationBarTitle
          link
          ...UseCasePageUrlFragment
        }
        industry {
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
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    VideoFragment,
    ImageFragment,
    InternalVideoFragment,
    InDepthCtaBlockFragment,
    UseCasePageUrlFragment,
    FeatureUrlFragment,
    PartnerUrlFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const siblingsQuery = graphql(
  /* GraphQL */ `
    query SiblingsQuery($position: IntType!) {
      previous: successStory(orderBy: position_DESC, filter: { position: { lt: $position } }) {
        name
        ...SuccessStoryUrlFragment
        coverImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      next: successStory(orderBy: position_ASC, filter: { position: { gt: $position } }) {
        name
        ...SuccessStoryUrlFragment
        coverImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      first: successStory(orderBy: position_ASC) {
        name
        ...SuccessStoryUrlFragment
        coverImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      last: successStory(orderBy: position_DESC) {
        name
        ...SuccessStoryUrlFragment
        coverImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [SuccessStoryUrlFragment, ResponsiveImageFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allSuccessStories(first: 500) {
            ...SuccessStoryUrlFragment
          }
        }
      `,
      [SuccessStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForSuccessStory);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: successStory(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
