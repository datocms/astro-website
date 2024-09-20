import exampleValueForSchema from '../exampleValueForSchema';
import type { RestApiEndpoint, RestApiEndpointHttpExample } from '../types';

export type HttpExampleFetchRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: unknown;
};

export function buildFetchRequest(
  endpoint: RestApiEndpoint,
  example?: RestApiEndpointHttpExample,
): HttpExampleFetchRequest {
  const request = example?.request;

  const rawRequestUrl = (request?.url || endpoint.href).replace(
    urlPlaceholderRegExp,
    (_matched, chunk) => {
      if (chunk === 'item_type') {
        return ':model_id_or_api_key';
      }

      if (chunk === 'field') {
        return ':field_id_or_api_key';
      }

      return `:${chunk}_id`;
    },
  );

  const rawRequestAsURL = new URL(rawRequestUrl, 'https://site-api.datocms.com');

  addSearchParamsToRequestUrl(rawRequestAsURL, endpoint);

  const method = request?.method || endpoint.method;

  return {
    url: rawRequestAsURL.toString(),
    method,
    headers: request?.headers || defaultRequestHeaders(endpoint),
    body:
      endpoint.schema && method !== 'GET' && method !== 'DELETE'
        ? request?.body !== undefined
          ? parseAsJsonIfString(request.body)
          : exampleValueForSchema(endpoint.schema)
        : undefined,
  };
}

const urlPlaceholderRegExp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

function addSearchParamsToRequestUrl(url: URL, endpoint: RestApiEndpoint) {
  if (!endpoint?.hrefSchema) {
    return;
  }

  for (const [param, value] of Object.entries(
    exampleValueForSchema(endpoint.hrefSchema) as Record<string, unknown>,
  )) {
    if (value) {
      url.searchParams.set(param, value.toString());
    }
  }
}

function defaultRequestHeaders(endpoint: RestApiEndpoint) {
  const result: Record<string, string> = {
    Authorization: 'Bearer YOUR-API-TOKEN',
    Accept: 'application/json',
    'X-Api-Version': '3',
  };

  if (endpoint.schema && endpoint.method !== 'GET' && endpoint.method !== 'DELETE') {
    result['Content-Type'] = 'application/vnd.api+json';
  }

  return result;
}

function parseAsJsonIfString(body: unknown): unknown {
  if (typeof body !== 'string') {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}
