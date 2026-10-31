import { camelCase } from 'lodash-es';
import * as prettier from 'prettier';
import { invariant } from '~/lib/invariant';
import exampleValueForSchema from '../exampleValueForSchema';
import type { RestApiEndpointJsClient } from '../fetchRestApiEndpointJsClient';
import type { RestApiEndpoint, RestApiEntity } from '../types';

function hasSimpleMethod(jsClient: RestApiEndpointJsClient) {
  return Boolean(jsClient.name);
}

function pluralize(string: string) {
  return `${string}s`;
}

function maybeDeserializeEntity(
  jsClient: RestApiEndpointJsClient,
  data: Record<string, unknown>,
  options: { skipId?: boolean } = {},
) {
  if (!hasSimpleMethod(jsClient)) {
    return JSON.stringify(data);
  }

  return JSON.stringify({
    ...(options.skipId ? {} : { id: data.id }),
    ...(data.attributes || {}),
    ...(data.meta ? { meta: data.meta } : {}),
    ...Object.fromEntries(
      Object.entries(data.relationships || {}).map(([key, value]) => [key, value.data]),
    ),
  });
}

function buildLinesBeforeApiCall(entity: RestApiEntity, jsClient: RestApiEndpointJsClient) {
  const lines: string[] = [
    'const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN });',
    '',
  ];

  for (const placeholder of jsClient.urlPlaceholders) {
    if (placeholder.variableName === 'itemTypeId') {
      lines.push(`const modelIdOrApiKey = 'blog_post';`);
    } else if (placeholder.variableName === 'fieldId') {
      lines.push(`const fieldIdOrApiKey = 'blog_post::title';`);
    } else {
      const resourceId = entity.definitions!.identity!.example || '3209482753';
      lines.push(`const ${placeholder.variableName} = '${resourceId}';`);
    }
  }

  return lines;
}

function buildApiCallArgs(endpoint: RestApiEndpoint, jsClient: RestApiEndpointJsClient) {
  const args: string[] = [];

  for (const placeholder of jsClient.urlPlaceholders) {
    if (placeholder.variableName === 'itemTypeId') {
      args.push('modelIdOrApiKey');
    } else if (placeholder.variableName === 'fieldId') {
      args.push('fieldIdOrApiKey');
    } else {
      args.push(placeholder.variableName);
    }
  }

  if (endpoint.schema && ['PUT', 'POST'].includes(endpoint.method)) {
    const example = exampleValueForSchema(endpoint.schema);

    if (isObject(example) && 'data' in example) {
      args.push(
        maybeDeserializeEntity(jsClient, example.data as Record<string, unknown>, {
          skipId: endpoint.method === 'POST',
        }),
      );
    }
  }

  if (endpoint.hrefSchema) {
    const example = exampleValueForSchema(endpoint.hrefSchema);

    if (isObject(example) && Object.keys(example).length > 0) {
      delete example.page;
      args.push(JSON.stringify(example));
    }
  }

  return args;
}

function buildApiCallInvocation(endpoint: RestApiEndpoint, jsClient: RestApiEndpointJsClient) {
  const namespace = jsClient.namespace;
  const action = jsClient.name || jsClient.rawName;

  const args = buildApiCallArgs(endpoint, jsClient);

  if (jsClient.paginatedResponse) {
    return `client.${namespace}.${action}PagedIterator(${args.join(',')})`;
  }

  return `client.${namespace}.${action}(${args.join(',')})`;
}

function buildApiCallAssignment(endpoint: RestApiEndpoint, jsClient: RestApiEndpointJsClient) {
  const responseSchema = endpoint.targetSchema || endpoint.jobSchema;
  const apiCallInvocation = buildApiCallInvocation(endpoint, jsClient);

  if (!responseSchema) {
    return `await ${apiCallInvocation};`;
  }

  const example = exampleValueForSchema(responseSchema);
  const singleVariableName = camelCase(jsClient.jsonApiType);

  invariant(isObject(example) && 'data' in example);
  ``;

  if (!Array.isArray(example.data)) {
    return `
      const ${singleVariableName} = await ${apiCallInvocation};

      // Check the 'Returned output' tab for the result ☝️
      console.log(${singleVariableName});
    `;
  }

  if (example.data.length === 0) {
    return `
      const result = await ${apiCallInvocation};

      // Check the 'Returned output' tab for the result ☝️
      console.log(result);
    `;
  }

  if (jsClient.paginatedResponse) {
    return `
      // iterates over every page of results
      for await (const ${singleVariableName} of ${apiCallInvocation}) {

        // Check the 'Returned output' tab for the result ☝️
        console.log(${singleVariableName});
      }
    `;
  }

  const pluralVariableName = pluralize(singleVariableName);

  return `
    const ${pluralVariableName} = await ${apiCallInvocation};

    for (const ${singleVariableName} of ${pluralVariableName}) {

      // Check the 'Returned output' tab for the result ☝️
      console.log(${singleVariableName});
    }
  `;
}

function rawBuildApiCallSampleCode(
  importStatement: string,
  entity: RestApiEntity,
  endpoint: RestApiEndpoint,
  jsClient: RestApiEndpointJsClient,
) {
  return `
    ${importStatement}

    async function run() {
      ${buildLinesBeforeApiCall(entity, jsClient).join('\n')}
      ${buildApiCallAssignment(endpoint, jsClient)}
    }

    run();
  `;
}

export async function buildApiCallSampleCode(
  importStatement: string,
  entity: RestApiEntity,
  endpoint: RestApiEndpoint,
  jsClient: RestApiEndpointJsClient,
) {
  return prettier.format(rawBuildApiCallSampleCode(importStatement, entity, endpoint, jsClient), {
    parser: 'babel',
  });
}

function rawBuildApiCallReturnValue(endpoint: RestApiEndpoint, jsClient: RestApiEndpointJsClient) {
  const responseSchema = endpoint.jobSchema || endpoint.targetSchema;

  if (!responseSchema) {
    return null;
  }

  const example = exampleValueForSchema(responseSchema);

  invariant(isObject(example) && 'data' in example);

  if (!Array.isArray(example.data)) {
    return maybeDeserializeEntity(jsClient, example.data as Record<string, unknown>);
  }

  if (example.data.length === 0) {
    return '[]';
  }

  if (jsClient.paginatedResponse) {
    return null;
  }

  return maybeDeserializeEntity(jsClient, example.data[0]);
}

export async function buildApiCallReturnValue(
  endpoint: RestApiEndpoint,
  jsClient: RestApiEndpointJsClient,
) {
  const result = rawBuildApiCallReturnValue(endpoint, jsClient);
  return result ? prettier.format(result, { parser: 'json5' }) : undefined;
}

function isObject(thing: unknown): thing is Record<string, unknown> {
  return Boolean(typeof thing === 'object' && thing);
}
