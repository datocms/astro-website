import { graphql } from '~/lib/datocms/graphql';
import { SectionFragment } from './Section/graphql';

export const SectionsFragment = graphql(
  /* GraphQL */ `
    fragment SectionsFragment on DocsPageRecord {
      sections {
        __typename
        ... on DocsHomeSectionBlockRecord {
          width
        }
        ...SectionFragment
      }
    }
  `,
  [SectionFragment],
);
