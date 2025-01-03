import { AcademyCourseUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';

export const AcademyCourseInlineFragment = graphql(
  /* GraphQL */ `
    fragment AcademyCourseInlineFragment on AcademyCourseRecord {
      name
      ...AcademyCourseUrlFragment
    }
  `,
  [AcademyCourseUrlFragment],
);
