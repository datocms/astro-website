import { graphql, readFragment, type FragmentOf } from '../graphql';

export const AcademyChapterUrlFragment = graphql(/* GraphQL */ `
  fragment AcademyChapterUrlFragment on AcademyChapterRecord {
    slug
    courses: _allReferencingAcademyCourses {
      slug
    }
  }
`);

export function buildUrlForAcademyChapter(
  academyChapter: FragmentOf<typeof AcademyChapterUrlFragment>,
) {
  const data = readFragment(AcademyChapterUrlFragment, academyChapter);
  const course = data.courses[0];

  if (!course) {
    throw new Error('No course?');
  }

  return `/academy/${course.slug}/${data.slug}`;
}
