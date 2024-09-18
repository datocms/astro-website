import $RefParser, { type JSONSchema } from '@apidevtools/json-schema-ref-parser';
import ky from 'ky';
import { invariant } from '~/lib/invariant';
import { temporarilyCache } from '~/lib/temporarlyCache';
import type { CmaHyperSchema } from './types';

// const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';

export const fetchSchema = temporarilyCache(60, async () => {
  const unreferencedSchema = await ky(url).json();
  const schema = await $RefParser.dereference(unreferencedSchema);
  isJsonSchema(schema);
  return schema as CmaHyperSchema;
});

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}
