import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { SectionsFragment } from './_sub/Sections';

export const query = graphql(
  /* GraphQL */ `
    query DocsHome {
      page: docsPage {
        _seoMetaTags {
          ...TagFragment
        }
        ...SectionsFragment
      }
    }
  `,
  [TagFragment, SectionsFragment],
);
