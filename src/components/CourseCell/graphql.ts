import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { AcademyCourseUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';

export const CourseCellFragment = graphql(
  /* GraphQL */ `
    fragment CourseCellFragment on AcademyCourseRecord {
      name
      introduction {
        value
      }
      chapters {
        ...AcademyChapterUrlFragment
        title
      }
      ...AcademyCourseUrlFragment
    }
  `,
  [AcademyChapterUrlFragment, AcademyCourseUrlFragment],
);
