import { TagFragment } from '~/lib/datocms/commonFragments';
import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
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
  [AcademyCourseUrlFragment, AcademyChapterUrlFragment, TagFragment],
);
