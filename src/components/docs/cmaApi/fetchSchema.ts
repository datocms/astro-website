import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { AstroGlobal } from 'astro';
import ky from 'ky';
import { dataSource } from '~/lib/dataSource';
import { invariant } from '~/lib/invariant';
import type { CmaHyperSchema, RestApiEntity } from '../restApi/types';

// const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';

export const [fetchCmaSchema, maybeInvalidateCmaHyperschema] = dataSource(
  'site-api-hyperschema',
  async () => {
    const unreferencedSchema = await ky(url).json();
    const schema = await $RefParser.dereference(unreferencedSchema);
    return schema as CmaHyperSchema;
  },
);

export async function findCmaEntity(astro: AstroGlobal, entitySlug: string) {
  const entityName = entitySlug.replace(/-/g, '_');

  const schema = await fetchCmaSchema(astro);

  invariant(schema.properties);

  return schema.properties[entityName] as RestApiEntity | undefined;
}

export async function findCmaJobResultSelfEndpoint(astro: AstroGlobal) {
  const entity = await findCmaEntity(astro, 'job-result');
  return entity?.links?.find((link) => link.rel === 'self')!;
}
