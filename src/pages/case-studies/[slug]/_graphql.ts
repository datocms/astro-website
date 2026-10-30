import { CaseStudiesStoryFragment } from '~/components/CaseStudies';
import { CaseStudyBodyStoryFragment } from '~/components/CaseStudyBody';
import { ChallengeSolutionStoryFragment } from '~/components/ChallengeSolution';
import { StatsNumberFragment } from '~/components/Stats';
import { TextWithImageStoryFragment } from '~/components/TextWithImage';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  buildUrlForSuccessStory,
  SuccessStoryUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/successStory';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

/*
 * The page gets the four latest stories: one of them can be the story of
 * the page, and the page shows three others.
 */
export const query = graphql(
  /* GraphQL */ `
    query SuccessStoryPage($slug: String!) {
      page: successStory(filter: { slug: { eq: $slug } }) {
        id
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        _firstPublishedAt
        title {
          value
        }
        coverImage {
          url
        }
        numbers {
          ...StatsNumberFragment
        }
        ...TextWithImageStoryFragment
        ...ChallengeSolutionStoryFragment
        ...CaseStudyBodyStoryFragment
      }
      latest: allSuccessStories(first: 4, orderBy: _firstPublishedAt_DESC) {
        id
        ...CaseStudiesStoryFragment
      }
    }
  `,
  [
    TagFragment,
    StatsNumberFragment,
    TextWithImageStoryFragment,
    ChallengeSolutionStoryFragment,
    CaseStudyBodyStoryFragment,
    CaseStudiesStoryFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allSuccessStories(first: 500) {
            _publishedAt
            ...SuccessStoryUrlFragment
          }
        }
      `,
      [SuccessStoryUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForSuccessStory(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
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
