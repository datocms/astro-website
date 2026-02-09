import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InDepthCtaBlockFragment } from '~/components/blocks/InDepthCtaBlock/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { VideoFragment } from '~/components/blocks/Video/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import {
  buildUrlForSuccessStory,
  SuccessStoryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/successStory';
import { UseCasePageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

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
          alt
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
    SuccessStoryUrlFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

const RelatedItemFragment = graphql(
  /* GraphQL */ `
    fragment RelatedItemFragment on SuccessStoryRecord @_unmask {
      name
      ...SuccessStoryUrlFragment
      subtitle {
        value
      }
      coverImage {
        responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment, SuccessStoryUrlFragment],
);

export const siblingsQuery = graphql(
  /* GraphQL */ `
    query SiblingsQuery($position: IntType!) {
      previous: successStory(orderBy: position_DESC, filter: { position: { lt: $position } }) {
        ...RelatedItemFragment
      }
      next: successStory(orderBy: position_ASC, filter: { position: { gt: $position } }) {
        ...RelatedItemFragment
      }
      first: successStory(orderBy: position_ASC) {
        ...RelatedItemFragment
      }
      last: successStory(orderBy: position_DESC) {
        ...RelatedItemFragment
      }
    }
  `,
  [RelatedItemFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allSuccessStories(first: 500) {
            ...SuccessStoryUrlFragment
            _updatedAt
          }
        }
      `,
      [SuccessStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(
    (entry): SitemapEntry => ({
      url: buildUrlForSuccessStory(entry),
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
        entity: successStory(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
