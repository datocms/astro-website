import ky from 'ky';

type EndpointInfo = {
  rel: string;
  name?: string;
  rawName: string;
  returnsCollection: boolean;
  urlTemplate: string;
  method: string;
  comment: string;
  docUrl?: string;
  urlPlaceholders: Array<{
    variableName: string;
    isEntityId: boolean;
    relType: string;
  }>;
  entityIdPlaceholder?: {
    variableName: string;
    isEntityId: boolean;
    relType: string;
  };
  simpleMethodAvailable: boolean;
  requestBodyType?: string;
  optionalRequestBody: boolean;
  requestStructure?: {
    type: string;
    idRequired?: boolean;
    attributes: string[] | '*';
    relationships: string[] | '*';
  };
  queryParamsType?: string;
  queryParamsRequired?: boolean;
  responseType?: string;
  deprecated?: string;
  paginatedResponse?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

type ResourceInfo = {
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
  endpoints: EndpointInfo[];
};

export type RestClientEndpointInfo = {
  endpoint: EndpointInfo;
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
};

export async function fetchRestClientEndpointInfo(entitySlug: string, endpointRel: string) {
  const resources = await ky<ResourceInfo[]>(
    'https://cdn.jsdelivr.net/npm/@datocms/cma-client@latest/resources.json',
  ).json();

  const foundResource = resources.find((r) => r.jsonApiType === entitySlug.replace(/\-/g, '_'));

  if (!foundResource) {
    return null;
  }

  const foundEndpoint = foundResource.endpoints.find((e) => e.rel === endpointRel);

  if (!foundEndpoint) {
    return null;
  }

  const { endpoints, ...resourceRest } = foundResource;

  return {
    ...resourceRest,
    endpoint: foundEndpoint,
  } as RestClientEndpointInfo;
}
