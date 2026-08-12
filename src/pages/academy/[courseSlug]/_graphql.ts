import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import {
  AcademyCourseUrlFragment,
  buildUrlForAcademyCourse,
} from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query AcademyCourse($courseSlug: String!) {
      course: academyCourse(filter: { slug: { eq: $courseSlug } }) {
        id
        _firstPublishedAt
        _publishedAt
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        illustration
        introduction {
          value
        }
        chapters {
          ...AcademyChapterUrlFragment
          id
          title
        }
        ...AcademyCourseUrlFragment
      }
    }
  `,
  [TagFragment, AcademyChapterUrlFragment, AcademyCourseUrlFragment],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allAcademyCourses(first: 500) {
            _publishedAt
            ...AcademyCourseUrlFragment
          }
        }
      `,
      [AcademyCourseUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map((entry) => ({
    url: buildUrlForAcademyCourse(entry),
    lastmod: entry._publishedAt ?? undefined,
  }));
};

export const paramsToRecordId: ParamsToRecordIdFn<{ courseSlug: string }> = async ({
  executeQueryOptions,
  params: { courseSlug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($courseSlug: String!) {
        entity: academyCourse(filter: { slug: { eq: $courseSlug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { courseSlug } },
  );

  return entity?.id;
};
