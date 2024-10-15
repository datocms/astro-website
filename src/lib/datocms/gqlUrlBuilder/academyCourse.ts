import { graphql, readFragment, type FragmentOf } from '../graphql';

export const AcademyCourseUrlFragment = graphql(/* GraphQL */ `
  fragment AcademyCourseUrlFragment on AcademyCourseRecord {
    slug
    chapters {
      slug
    }
  }
`);

export function buildUrlForAcademyCourse(
  academyCourse: FragmentOf<typeof AcademyCourseUrlFragment>,
) {
  const data = readFragment(AcademyCourseUrlFragment, academyCourse);
  const firstChapter = data.chapters[0];

  if (!firstChapter) {
    throw new Error('No chapters!');
  }

  return `/academy/${data.slug}/${firstChapter.slug}`;
}
