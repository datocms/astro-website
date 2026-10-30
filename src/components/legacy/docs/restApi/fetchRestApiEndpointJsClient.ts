// Shared types and implementation for REST API JavaScript client information
// Used by both CMA and Dashboard API implementations

import ky from 'ky';

export type EndpointInfo = {
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

export type RestApiEndpointJsClient = {
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
} & EndpointInfo;

export type JsClientResourcesResponse = Array<{
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
  endpoints: EndpointInfo[];
}>;

export async function fetchRestApiEndpointJsClient(
  resourcesJsonUrl: string,
  entitySlug: string,
  endpointRel: string,
): Promise<RestApiEndpointJsClient | null> {
  const resources = await ky<JsClientResourcesResponse>(resourcesJsonUrl).json();

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
    ...foundEndpoint,
  } as RestApiEndpointJsClient;
}
