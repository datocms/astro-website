import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { defaultInlineRecordFragments } from '~/components/inlineRecords';
import { defaultLinkToRecordFragments } from '~/components/linkToRecords';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForUserGuidesEpisode,
  UserGuidesEpisodeUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const EpisodeFragment = graphql(
  /* GraphQL */ `
    fragment EpisodeFragment on UserGuidesEpisodeRecord {
      title
      asset: video {
        video {
          thumbnailUrl
          width
          height
          blurUpThumb
          duration
        }
      }
      thumbTimeSeconds
      ...UserGuidesEpisodeUrlFragment
    }
  `,
  [UserGuidesEpisodeUrlFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query UserGuidesItemQuery($episodeSlug: String!) {
      episode: userGuidesEpisode(filter: { slug: { eq: $episodeSlug } }) {
        id
        _seoMetaTags {
          ...TagFragment
        }
        title
        asset: video {
          ...VideoPlayerFragment
          video {
            duration
          }
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
            ...InternalVideoFragment
          }
        }
      }
      chapters: allUserGuidesChapters(orderBy: position_ASC) {
        id
        title
        slug
        episodes: videos {
          id
          ...EpisodeFragment
          ...UserGuidesEpisodeUrlFragment
        }
      }
    }
  `,
  [
    TagFragment,
    VideoPlayerFragment,
    InternalVideoFragment,
    EpisodeFragment,
    UserGuidesEpisodeUrlFragment,
    ...defaultLinkToRecordFragments,
    ...defaultInlineRecordFragments,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allUserGuidesEpisodes(first: 500) {
            ...UserGuidesEpisodeUrlFragment
          }
        }
      `,
      [UserGuidesEpisodeUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForUserGuidesEpisode);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ episodeSlug: string }> = async ({
  executeQueryOptions,
  params: { episodeSlug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($episodeSlug: String!) {
        entity: userGuidesEpisode(filter: { slug: { eq: $episodeSlug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { episodeSlug } },
  );

  return entity?.id;
};
