import { executeQuery } from '@datocms/cda-client';
import type { Client, RawApiTypes } from '@datocms/cma-client';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import type { FragmentDefinitionNode } from 'graphql';
import { camelCase, upperFirst } from 'lodash-es';
import { buildUrlFromGql } from '~/lib/datocms/gqlUrlBuilder';
import { graphql } from './graphql';

const allUrlBuilderFragments = import.meta.glob('./gqlUrlBuilder/*.ts', {
  eager: false,
});

type RecordToWebsiteRouteOptions = {
  item: RawApiTypes.Item;
  itemTypeApiKey: string;
  client: Client;
};

export async function recordToWebsiteRoute({
  item,
  itemTypeApiKey,
}: RecordToWebsiteRouteOptions): Promise<string | null> {
  const gqlFieldName = camelCase(itemTypeApiKey);
  const importPath = `./gqlUrlBuilder/${gqlFieldName}.ts`;
  const modulePromise = allUrlBuilderFragments[importPath];

  if (!modulePromise) {
    return null;
  }

  const importedModule = (await modulePromise()) as any;

  const fragmentExportName = `${upperFirst(gqlFieldName)}UrlFragment`;

  if (!(fragmentExportName in importedModule)) {
    throw new Error(`Missing ${fragmentExportName} in ${importPath}!`);
  }

  const fragment = importedModule[fragmentExportName] as TadaDocumentNode;
  const fragmentName = (fragment.definitions[0] as FragmentDefinitionNode).name.value;

  const query = graphql(
    /* GraphQL */ `
    query UrlBuilder($id: ItemId!) {
      thing: ${gqlFieldName}(filter: { id: { eq: $id } }) {
        __typename
        ...${fragmentName}
      }
    }
  `,
    [fragment as any],
  );

  const { thing } = await executeQuery<any, any>(query, {
    token: DATOCMS_API_TOKEN,
    includeDrafts: true,
    variables: { id: item.id },
  });

  return buildUrlFromGql(thing);
}

export async function recordToSlug(
  item: RawApiTypes.Item,
  itemTypeApiKey: string,
): Promise<string | null> {
  switch (itemTypeApiKey) {
    default:
      return item.attributes.slug as string;
  }
}
