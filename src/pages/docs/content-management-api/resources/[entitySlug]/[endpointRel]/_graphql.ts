import { fetchSchema } from '~/components/docs/restApi/fetchSchema';
import type { RestApiEntity } from '~/components/docs/restApi/types';
import { invariant } from '~/lib/invariant';

export const buildSitemapUrls = async () => {
  const schema = await fetchSchema();
  invariant(schema.properties);

  return Object.entries(schema.properties).flatMap(([entityName, entitySchema]) => {
    const entitySlug = entityName.replace(/_/g, '-');
    return (entitySchema as RestApiEntity).links!.map(
      (endpoint) => `/docs/content-management-api/resources/${entitySlug}/${endpoint.rel}`,
    );
  });
};
