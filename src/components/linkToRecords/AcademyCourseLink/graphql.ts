import { AcademyCourseUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';

export const AcademyCourseLinkFragment = graphql(
  /* GraphQL */ `
    fragment AcademyCourseLinkFragment on AcademyCourseRecord {
      ...AcademyCourseUrlFragment
    }
  `,
  [AcademyCourseUrlFragment],
);
