import { graphql, readFragment, type FragmentOf } from './graphql';

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
      }),
) {
  switch (thing.__typename) {
    case 'DocPageRecord':
      return buildUrlForDocPage(thing);
    case 'FeatureRecord':
      return buildUrlForFeature(thing);
  }
}
