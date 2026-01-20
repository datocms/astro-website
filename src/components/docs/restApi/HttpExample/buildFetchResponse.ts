import { httpStatusTextByCode } from 'http-status-ts';
import exampleValueForSchema from '../exampleValueForSchema';
import type { RestApiEndpoint, RestApiEndpointHttpExample } from '../types';

export type HttpExampleFetchResponse = {
  statusCode: string | number;
  statusText: string;
  headers: Record<string, string>;
  body: string | null;
};

export function buildFetchResponse(
  endpoint: RestApiEndpoint,
  example?: RestApiEndpointHttpExample,
): HttpExampleFetchResponse | undefined {
  const response = example?.response;

  if (!endpoint.targetSchema) {
    return undefined;
  }

  // Prefer an explicit status code from the response definition
  // Otherwise fall back to defaults (202 for a job, 200 for others)
  const statusCode = response?.statusCode ?? (endpoint.jobSchema ? 202 : 200);

  return {
    statusCode,
    statusText: httpStatusTextByCode(statusCode),
    headers: response?.headers || {
      'Content-Type': 'application/json',
      'Cache-Control': 'cache-control: max-age=0, private, must-revalidate',
      'X-RateLimit-Limit': '30',
      'X-RateLimit-Remaining': '28',
    },
    body: response?.body
      ? response.body.trim()
      : endpoint.targetSchema
        ? JSON.stringify(exampleValueForSchema(endpoint.targetSchema), null, 2).trim()
        : null,
  };
}
