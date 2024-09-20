import { invariant } from '~/lib/invariant';
import { fetchSchema } from './fetchSchema';
import type { RestApiEntity } from './types';

export async function findEntity(entitySlug: string) {
  const entityName = entitySlug.replace(/-/g, '_');

  const schema = await fetchSchema();

  invariant(schema.properties);

  return schema.properties[entityName] as RestApiEntity | undefined;
}
