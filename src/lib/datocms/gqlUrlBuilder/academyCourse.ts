import { graphql, readFragment, type FragmentOf } from '../graphql';

export const AcademyCourseUrlFragment = graphql(/* GraphQL */ `
  fragment AcademyCourseUrlFragment on AcademyCourseRecord {
    slug
  }
`);

export function buildUrlForAcademyCourse(
  academyCourse: FragmentOf<typeof AcademyCourseUrlFragment>,
) {
  const data = readFragment(AcademyCourseUrlFragment, academyCourse);
  return `/academy/${data.slug}`;
}
