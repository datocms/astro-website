import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { AcademyCourseUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyCourse';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query AcademyIndex {
      page: academyPage {
        seo: _seoMetaTags {
          tag
          attributes
          content
        }
      }
      courses: allAcademyCourses(orderBy: position_ASC) {
        slug
        name
        illustration
        introduction {
          value
        }
        chapters {
          ...AcademyChapterUrlFragment
          title
        }
        ...AcademyCourseUrlFragment
      }
    }
  `,
  [AcademyCourseUrlFragment, AcademyChapterUrlFragment],
);
