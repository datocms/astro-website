import { AcademyChapterUrlFragment } from '~/lib/datocms/gqlUrlBuilder/academyChapter';
import { graphql } from '~/lib/datocms/graphql';

export const AcademyChapterLinkFragment = graphql(
  /* GraphQL */ `
    fragment AcademyChapterLinkFragment on AcademyChapterRecord {
      ...AcademyChapterUrlFragment
    }
  `,
  [AcademyChapterUrlFragment],
);
