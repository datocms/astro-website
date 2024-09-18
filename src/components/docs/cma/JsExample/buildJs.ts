import type { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import { camelCase } from 'lodash-es';
import * as prettier from 'prettier';
import { invariant } from '~/lib/invariant';
import type { RestClientEndpointInfo } from '../fetchRestClientEndpointInfo';
import type { CmaEndpoint, CmaEntity } from '../types';
import exampleValueForSchema from './exampleValueForSchema';
function pluralize(string: string) {
  return `${string}s`;
}

function deserializeEntity(data: Record<string, unknown>, withId = false) {
  const id = withId ? { id: data.id } : {};

  return {
    ...id,
    ...(data.attributes || {}),
    ...(data.meta ? { meta: data.meta } : {}),
    ...Object.fromEntries(
      Object.entries(data.relationships || {}).map(([key, value]) => [key, value.data]),
    ),
  };
}

function buildLinesBeforeApiCall(
  entity: CmaEntity,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  const lines: string[] = [
    'const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN });',
    '',
  ];

  for (const placeholder of restClientEndpointInfo.endpoint.urlPlaceholders) {
    if (placeholder.variableName === 'itemTypeId') {
      lines.push(`const modelIdOrApiKey = 'blog_post';`);
    } else if (placeholder.variableName === 'fieldId') {
      lines.push(`const fieldIdOrApiKey = 'blog_post::title';`);
    } else {
      isJsonSchema(entity.definitions?.identity);
      const resourceId = (entity.definitions.identity as any).example || '3209482753';
      lines.push(`const ${placeholder.variableName} = '${resourceId}';`);
    }
  }

  return lines;
}

function buildApiCallArgs(endpoint: CmaEndpoint, restClientEndpointInfo: RestClientEndpointInfo) {
  const args: string[] = [];

  for (const placeholder of restClientEndpointInfo.endpoint.urlPlaceholders) {
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
        JSON.stringify(
          deserializeEntity(example.data as Record<string, unknown>, endpoint.method === 'POST'),
          null,
          2,
        ),
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

function buildApiCallInvocation(
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  const namespace = restClientEndpointInfo.namespace;
  const action = restClientEndpointInfo.endpoint.name;
  const args = buildApiCallArgs(endpoint, restClientEndpointInfo);

  if (restClientEndpointInfo.endpoint.paginatedResponse) {
    return `client.${namespace}.${action}PagedIterator(${args.join(',')})`;
  }

  return `client.${namespace}.${action}(${args.join(',')})`;
}

function buildApiCallAssignment(
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  const responseSchema = endpoint.targetSchema || endpoint.jobSchema;
  const apiCallInvocation = buildApiCallInvocation(endpoint, restClientEndpointInfo);

  if (!responseSchema) {
    return `await ${apiCallInvocation};`;
  }

  const example = exampleValueForSchema(responseSchema);
  const singleVariableName = camelCase(restClientEndpointInfo.jsonApiType);

  invariant(isObject(example) && 'data' in example);
  ``;

  if (!Array.isArray(example.data)) {
    return `
      const ${singleVariableName} = await ${apiCallInvocation};
      console.log(${singleVariableName});
    `;
  }

  if (example.data.length === 0) {
    return `
      const result = await ${apiCallInvocation};
      console.log(result);
    `;
  }

  if (restClientEndpointInfo.endpoint.paginatedResponse) {
    return `
      // iterates over every page of results
      for await (const ${singleVariableName} of ${apiCallInvocation}) {
        console.log(${singleVariableName});
      }
    `;
  }

  const pluralVariableName = pluralize(singleVariableName);

  return `
    const ${pluralVariableName} = await ${apiCallInvocation};

    for (const ${singleVariableName} of ${pluralVariableName}) {
      console.log(${singleVariableName});
    }
  `;
}

function rawBuildApiCallSampleCode(
  entity: CmaEntity,
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  return `
    ${buildLinesBeforeApiCall(entity, restClientEndpointInfo).join('\n')}
    ${buildApiCallAssignment(endpoint, restClientEndpointInfo)}
  `;
}

export async function buildApiCallSampleCode(
  entity: CmaEntity,
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  return prettier.format(rawBuildApiCallSampleCode(entity, endpoint, restClientEndpointInfo), {
    parser: 'babel',
  });
}

function rawBuildApiCallReturnValue(
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  const responseSchema = endpoint.targetSchema || endpoint.jobSchema;

  if (!responseSchema) {
    return null;
  }

  const example = exampleValueForSchema(responseSchema);

  invariant(isObject(example) && 'data' in example);

  if (!Array.isArray(example.data)) {
    return JSON.stringify(deserializeEntity(example.data as Record<string, unknown>, true));
  }

  if (example.data.length === 0) {
    return '[]';
  }

  if (restClientEndpointInfo.endpoint.paginatedResponse) {
    return null;
  }

  return JSON.stringify(deserializeEntity(example.data[0], true));
}

export async function buildApiCallReturnValue(
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
) {
  const result = rawBuildApiCallReturnValue(endpoint, restClientEndpointInfo);
  return result ? prettier.format(result, { parser: 'json5' }) : undefined;
}

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}

function isObject(thing: unknown): thing is Record<string, unknown> {
  return Boolean(typeof thing === 'object' && thing);
}
