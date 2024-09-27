import { graphql, readFragment, type FragmentOf } from '../graphql';

export const DocGroupUrlFragment = graphql(/* GraphQL */ `
  fragment DocGroupUrlFragment on DocGroupRecord {
    slug
    pagesOrSections: pages {
      __typename
      ... on DocGroupPageRecord {
        page {
          slug
        }
      }
      ... on DocGroupSectionRecord {
        pages {
          page {
            slug
          }
        }
      }
    }
  }
`);

export function buildUrlForDocGroup(docGroup: FragmentOf<typeof DocGroupUrlFragment>) {
  const data = readFragment(DocGroupUrlFragment, docGroup);
  const firstPageOrSection = data.pagesOrSections[0]!;

  if (firstPageOrSection.__typename === 'DocGroupPageRecord') {
    return `/docs/${data.slug}${firstPageOrSection.page.slug === 'index' ? '' : `/${firstPageOrSection.page.slug}`}`;
  } else {
    const firstPage = firstPageOrSection.pages[0]!;
    return `/docs/${data.slug}${firstPage.page.slug === 'index' ? '' : `/${firstPage.page.slug}`}`;
  }
}
