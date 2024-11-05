import { graphql, readFragment, type FragmentOf } from '../graphql';

export const DocPageUrlFragment = graphql(/* GraphQL */ `
  fragment DocPageUrlFragment on DocPageRecord {
    slug
    parent: _allReferencingDocGroups {
      slug
    }
  }
`);

export function buildUrlForDocPage(docPage: FragmentOf<typeof DocPageUrlFragment>) {
  const data = readFragment(DocPageUrlFragment, docPage);

  if (!data.parent[0]) {
    throw new Error('Missing doc group!');
  }

  return `/docs/${data.parent[0].slug}${data.slug === 'index' ? '' : `/${data.slug}`}`;
}
