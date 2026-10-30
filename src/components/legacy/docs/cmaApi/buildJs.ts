import {
  buildApiCallSampleCode as buildApiCallSampleCodeShared,
  buildApiCallReturnValue,
} from '../restApi/JsExample/buildJs';
import type { RestApiEndpoint, RestApiEntity } from '../restApi/types';
import type { RestApiEndpointJsClient } from '../restApi/fetchRestApiEndpointJsClient';

const IMPORT_STATEMENT = "import { buildClient } from '@datocms/cma-client-node';";

export async function buildApiCallSampleCode(
  entity: RestApiEntity,
  endpoint: RestApiEndpoint,
  jsClient: RestApiEndpointJsClient,
) {
  return buildApiCallSampleCodeShared(IMPORT_STATEMENT, entity, endpoint, jsClient);
}

export { buildApiCallReturnValue };
