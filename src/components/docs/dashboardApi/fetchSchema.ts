import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { AstroGlobal } from 'astro';
import ky from 'ky';
import { dataSource } from '~/lib/dataSource';
import { invariant } from '~/lib/invariant';
import type { Hyperschema, RestApiEntity } from '../restApi/types';

// const url = 'http://localhost:3001/docs/account-api-hyperschema.json';
const url = 'https://site-api.datocms.com/docs/account-api-hyperschema.json';

export const [fetchDashboardSchema, maybeInvalidateDashboardHyperschema] = dataSource(
  'account-api-hyperschema',
  async () => {
    const unreferencedSchema = await ky(url).json();
    const schema = await $RefParser.dereference(unreferencedSchema);
    return schema as Hyperschema;
  },
);

export async function findDashboardEntity(astro: AstroGlobal, entitySlug: string) {
  const entityName = entitySlug.replace(/-/g, '_');

  const schema = await fetchDashboardSchema(astro);

  invariant(schema.properties);

  return schema.properties[entityName] as RestApiEntity | undefined;
}

export async function findDashboardJobResultSelfEndpoint(astro: AstroGlobal) {
  const entity = await findDashboardEntity(astro, 'job-result');
  return entity?.links?.find((link) => link.rel === 'self')!;
}
