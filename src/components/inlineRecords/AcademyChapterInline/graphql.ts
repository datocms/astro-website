import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { graphql } from '~/lib/datocms/graphql';

export const AcademyChapterInlineFragment = graphql(
  /* GraphQL */ `
    fragment AcademyChapterInlineFragment on AcademyChapterRecord {
      title
      ...AcademyChapterUrlFragment
    }
  `,
  [AcademyChapterUrlFragment],
);
