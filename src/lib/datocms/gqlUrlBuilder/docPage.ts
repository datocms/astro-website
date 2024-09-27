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
  return `/docs/${data.parent[0]!.slug}${data.slug === 'index' ? '' : `/${data.slug}`}`;
}
