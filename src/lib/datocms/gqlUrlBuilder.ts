import { graphql, readFragment, type FragmentOf } from './graphql';

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

function buildUrlForDocGroup(docGroup: FragmentOf<typeof DocGroupUrlFragment>) {
  const data = readFragment(DocGroupUrlFragment, docGroup);
  const firstPageOrSection = data.pagesOrSections[0]!;

  if (firstPageOrSection.__typename === 'DocGroupPageRecord') {
    return `/docs/${data.slug}${firstPageOrSection.page.slug ? `/${firstPageOrSection.page.slug}` : ''}`;
  } else {
    const firstPage = firstPageOrSection.pages[0]!;
    return `/docs/${data.slug}${firstPage.page.slug ? `/${firstPage.page.slug}` : ''}`;
  }
}

export const DocPageUrlFragment = graphql(/* GraphQL */ `
  fragment DocPageUrlFragment on DocPageRecord {
    slug
    parent: _allReferencingDocGroups {
      slug
    }
  }
`);

function buildUrlForDocPage(docPage: FragmentOf<typeof DocPageUrlFragment>) {
  const data = readFragment(DocPageUrlFragment, docPage);
  return `/docs/${data.parent[0]!.slug}/${data.slug}`;
}

export const FeatureUrlFragment = graphql(/* GraphQL */ `
  fragment FeatureUrlFragment on FeatureRecord {
    slug
  }
`);

function buildUrlForFeature(feature: FragmentOf<typeof FeatureUrlFragment>) {
  const data = readFragment(FeatureUrlFragment, feature);
  return `/features/${data.slug}`;
}

export function buildUrlFromGql(
  thing:
    | (FragmentOf<typeof DocPageUrlFragment> & {
        __typename: 'DocPageRecord';
      })
    | (FragmentOf<typeof FeatureUrlFragment> & {
        __typename: 'FeatureRecord';
      })
    | (FragmentOf<typeof DocGroupUrlFragment> & {
        __typename: 'DocGroupRecord';
      }),
) {
  switch (thing.__typename) {
    case 'DocPageRecord':
      return buildUrlForDocPage(thing);
    case 'FeatureRecord':
      return buildUrlForFeature(thing);
    case 'DocGroupRecord':
      return buildUrlForDocGroup(thing);
  }
}
