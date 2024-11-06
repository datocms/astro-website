import { ImageFragment } from '~/components/blocks/Image/graphql';
import { InternalVideoFragment } from '~/components/blocks/InternalVideo/graphql';
import { TableFragment } from '~/components/blocks/Table/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  AcademyChapterUrlFragment,
  buildUrlForAcademyChapter,
} from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query AcademyChapter($courseSlug: String!, $chapterSlug: String!) {
      chapter: academyChapter(filter: { slug: { eq: $chapterSlug } }) {
        id
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ... on ImageRecord {
              ...ImageFragment
            }
            ... on InternalVideoRecord {
              ...InternalVideoFragment
            }
            ... on TableRecord {
              ...TableFragment
            }
          }
        }
        matchingCourses: _allReferencingAcademyCourses(filter: { slug: { eq: $courseSlug } }) {
          name
          introduction {
            value
          }
          chapters {
            ...AcademyChapterUrlFragment
            id
            title
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ImageFragment,
    InternalVideoFragment,
    TableFragment,
    AcademyChapterUrlFragment,
    ResponsiveImageFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async ({ includeDrafts }) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allAcademyChapters(first: 500) {
            ...AcademyChapterUrlFragment
          }
        }
      `,
      [AcademyChapterUrlFragment],
    ),
    { includeDrafts },
  );

  return entries.map(buildUrlForAcademyChapter);
};
