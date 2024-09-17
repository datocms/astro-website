import $RefParser, { type JSONSchema } from '@apidevtools/json-schema-ref-parser';
import ky from 'ky';
import { invariant } from '~/lib/invariant';
import { temporarilyCache } from '~/lib/temporarlyCache';

const schemaUrl = 'https://site-api.datocms.com/docs/dast-schema.json';

export const fetchDastSchema = temporarilyCache(60, async () => {
  const unreferencedSchema = await ky(schemaUrl).json();

  const schema = await $RefParser.dereference(unreferencedSchema);

  invariant(schema.definitions);

  const { Root } = schema.definitions;

  isJsonSchema(Root);

  return findChildrenDefinitions(Root);
});

function findChildrenDefinitions(
  definition: JSONSchema,
  foundDefs: JSONSchema[] = [],
): JSONSchema[] {
  if (foundDefs.includes(definition)) {
    return foundDefs;
  }

  const result: JSONSchema[] = [...foundDefs, definition];

  const children = definition.properties?.children;

  if (!children) {
    return result;
  }

  isJsonSchema(children);
  isJsonSchema(children.items);

  const normalizedChildren: JSONSchema[] =
    'anyOf' in children.items ? (children.items.anyOf as JSONSchema[]) : [children.items];

  return normalizedChildren.reduce((acc, def) => findChildrenDefinitions(def, acc), result);
}

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}
