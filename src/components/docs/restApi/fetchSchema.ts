import $RefParser from '@apidevtools/json-schema-ref-parser';
import ky from 'ky';
import { invariant } from '~/lib/invariant';
import { temporarilyCache } from '~/lib/temporarlyCache';
import type { CmaHyperSchema, RestApiEntity } from './types';

// const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';

export const fetchSchema = temporarilyCache(60, async () => {
  const unreferencedSchema = await ky(url).json();
  const schema = await $RefParser.dereference(unreferencedSchema);
  return schema as CmaHyperSchema;
});

export async function findEntity(entitySlug: string) {
  const entityName = entitySlug.replace(/-/g, '_');

  const schema = await fetchSchema();

  invariant(schema.properties);

  return schema.properties[entityName] as RestApiEntity | undefined;
}

export async function findJobResultSelfEndoint() {
  const entity = await findEntity('job-result');
  return entity?.links?.find((link) => link.rel === 'self')!;
}
