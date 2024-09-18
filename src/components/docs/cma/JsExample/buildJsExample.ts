import type { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import { camelCase } from 'lodash-es';
import { invariant } from '~/lib/invariant';
import type { RestClientEndpointInfo } from '../fetchRestClientEndpointInfo';
import type { CmaEndpoint, CmaEntity } from '../types';
import schemaExampleFor from './schemaExampleFor';

const regexp = /{\(%2Fschemata%2F([^%]+)[^}]*}/g;

export const jsonToJs = (string: string) =>
  string.replace(/"([^[\-"]+)": /g, '$1: ').replace(/"/g, "'");

function pluralize(string: string) {
  return `${string}s`;
}

export function buildJsExample(
  entity: CmaEntity,
  endpoint: CmaEndpoint,
  restClientEndpointInfo: RestClientEndpointInfo,
  allPages = false,
): { code: string; output: string } {
  const params: string[] = [];
  const precode: string[] = [];

  const placeholders: string[] = [];
  let match = regexp.exec(endpoint.href);

  while (match != null) {
    placeholders.push(match[1]!);
    match = regexp.exec(endpoint.href);
  }

  isJsonSchema(entity.definitions?.identity);

  const resourceId = (entity.definitions.identity as any).example || '3209482753';

  for (const placeholder of placeholders) {
    if (placeholder === 'item_type') {
      precode.push(`const modelIdOrApiKey = 'blog_post';`);
      params.push('modelIdOrApiKey');
    } else if (placeholder === 'field') {
      precode.push(`const fieldIdOrApiKey = 'blog_post::title';`);
      params.push('fieldIdOrApiKey');
    } else {
      precode.push(`const ${camelCase(placeholder)}Id = '${resourceId}';`);
      params.push(`${camelCase(placeholder)}Id`);
    }
  }

  const deserialize = (data: Record<string, unknown>, withId = false) => {
    const id = withId ? { id: data.id } : {};

    return {
      ...id,
      ...(data.attributes || {}),
      ...(data.meta ? { meta: data.meta } : {}),
      ...Object.fromEntries(
        Object.entries(data.relationships || {}).map(([key, value]) => [key, value.data]),
      ),
    };
  };

  if (endpoint.schema && ['PUT', 'POST'].includes(endpoint.method)) {
    const example = schemaExampleFor(endpoint.schema, !allPages);

    if (isObject(example) && 'data' in example) {
      params.push(
        jsonToJs(
          JSON.stringify(
            deserialize(example.data as Record<string, unknown>, endpoint.method === 'POST'),
            null,
            2,
          ),
        ),
      );
    }
  }

  if (endpoint.hrefSchema) {
    const example = schemaExampleFor(endpoint.hrefSchema, !allPages);

    if (isObject(example) && Object.keys(example).length > 0) {
      params.push(jsonToJs(JSON.stringify(example, null, 2)));
    }
  }

  const namespace = restClientEndpointInfo.namespace;
  const action = restClientEndpointInfo.endpoint.name;

  let paramsCode = '';
  if (params.length > 0) {
    if (allPages) {
      paramsCode += `(\n${params.join(',\n').replace(/^/gm, '  ')}\n)`;
    } else {
      paramsCode += `(${params.join(', ')})`;
    }
  } else {
    paramsCode += '()';
  }

  const call = `client.${namespace}.${action}${paramsCode}`;

  let returnCode: string;
  let output = '';

  if (endpoint.targetSchema || endpoint.jobSchema) {
    const example = schemaExampleFor(endpoint.jobSchema || endpoint.targetSchema);

    const singleVariable = camelCase(entity.id);

    if (isObject(example) && 'data' in example && Array.isArray(example.data)) {
      const multipleVariable = camelCase(pluralize(entity.id));

      if (example.data.length > 0) {
        if (!allPages) {
          output = jsonToJs(JSON.stringify(deserialize(example.data[0], true), null, 2));

          returnCode = `const ${multipleVariable} = await ${call};

${multipleVariable}.forEach((${singleVariable}) => {
  console.log(${singleVariable});
});`;
        } else {
          returnCode = `for await (const ${singleVariable} of client.${namespace}.${action}PagedIterator${paramsCode}) {
  console.log(${singleVariable});
}`;
        }
      } else {
        output = '[]';
        returnCode = `const result = await ${call};

console.log(result);`;
      }
    } else {
      output = jsonToJs(JSON.stringify(deserialize(example.data, true), null, 2));

      returnCode = `const ${singleVariable} = await ${call};

console.log(${singleVariable});`;
    }
  } else {
    returnCode = `await ${call};`;
  }

  if (!allPages) {
    const isPaginated = restClientEndpointInfo.endpoint.paginatedResponse;

    const body = `const client = buildClient({ apiToken: '<YOUR_API_TOKEN>' });
${precode.length > 0 ? '\n' : ''}${precode.join('\n')}${precode.length > 0 ? '\n' : ''}${
      returnCode
        ? `${isPaginated ? '\n// this only returns the first page of results:' : ''}\n${returnCode}`
        : ''
    }
${
  isPaginated
    ? `\n\n// this iterates over every page of results:${
        buildJsExample(entity, endpoint, restClientEndpointInfo, true).code
      }`
    : ''
}`;

    const code = `import { buildClient } from '@datocms/cma-client-node';

async function run() {
${body
  .trim()
  .split('\n')
  .map((x) => `  ${x}`)
  .join('\n')}
}

run();`;

    return { code, output };
  }

  const code = `
${returnCode}`;

  return { code, output };
}

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}

function isObject(thing: unknown): thing is Record<string, unknown> {
  return Boolean(typeof thing === 'object' && thing);
}
