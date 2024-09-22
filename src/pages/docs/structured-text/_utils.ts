import $RefParser, { type JSONSchema } from '@apidevtools/json-schema-ref-parser';
import ky from 'ky';
import { invariant } from '~/lib/invariant';
import { cachedFn } from '~/lib/temporarlyCache';

const schemaUrl = 'https://site-api.datocms.com/docs/dast-schema.json';

type Node = {
  name: string;
  description: string;
  childrenNodes: string[];
  schema: JSONSchema;
  example?: { code: string; language: string };
};

export async function fetchDastNodes(): Promise<Node[]> {
  const nodes = await fetchDastSchema();

  return nodes.map((node) => {
    invariant(node.properties);
    isJsonSchema(node.properties.type);

    const children = findChildren(node);

    const match = node.description!.match(/```([a-z]+)\n((.*\n)+)```/);
    const description = node.description!.replace(/```([a-z]+)\n((.*\n)+)```/g, '');

    return {
      name: nodeName(node),
      description,
      childrenNodes: children.map(nodeName),
      schema: node,
      example: match
        ? {
            code: match[2]!.trim(),
            language: match[1]!,
          }
        : undefined,
    };
  });
}

const fetchDastSchema = cachedFn(async () => {
  const unreferencedSchema = await ky(schemaUrl).json();

  const schema = await $RefParser.dereference(unreferencedSchema);

  invariant(schema.definitions);

  const { Root } = schema.definitions;

  isJsonSchema(Root);

  return recursivelyFindChildren(Root);
});

function recursivelyFindChildren(
  definition: JSONSchema,
  foundDefs: JSONSchema[] = [],
): JSONSchema[] {
  if (foundDefs.includes(definition)) {
    return foundDefs;
  }

  const result: JSONSchema[] = [...foundDefs, definition];
  return findChildren(definition).reduce((acc, def) => recursivelyFindChildren(def, acc), result);
}

function findChildren(schema: JSONSchema) {
  const children = schema.properties?.children;

  if (!children) {
    return [];
  }

  isJsonSchema(children);
  isJsonSchema(children.items);

  return 'anyOf' in children.items ? (children.items.anyOf as JSONSchema[]) : [children.items];
}

function nodeName(schema: JSONSchema) {
  invariant(schema.properties);
  isJsonSchema(schema.properties.type);

  return schema.properties.type.const!;
}

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}
