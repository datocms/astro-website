import { TagFragment } from '~/lib/datocms/commonFragments';
import { CourseCellFragment } from '~/components/CourseCell';
import { AcademyCourseUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query AcademyIndex {
      page: academyPage {
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
      courses: allAcademyCourses(orderBy: position_ASC) {
        id
        chapters {
          id
        }
        ...CourseCellFragment
        ...AcademyCourseUrlFragment
      }
    }
  `,
  [CourseCellFragment, AcademyCourseUrlFragment, TagFragment],
);
