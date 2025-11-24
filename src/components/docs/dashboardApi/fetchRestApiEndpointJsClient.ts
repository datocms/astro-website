import {
  fetchRestApiEndpointJsClient as fetchRestApiEndpointJsClientShared,
  type RestApiEndpointJsClient,
} from '../restApi/fetchRestApiEndpointJsClient';

export async function fetchRestApiEndpointJsClient(
  entitySlug: string,
  endpointRel: string,
): Promise<RestApiEndpointJsClient | null> {
  return fetchRestApiEndpointJsClientShared(
    'https://cdn.jsdelivr.net/npm/@datocms/dashboard-client@latest/resources.json',
    entitySlug,
    endpointRel,
  );
}
