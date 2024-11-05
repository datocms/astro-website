import { fetchSchema } from '~/components/docs/restApi/fetchSchema';
import { invariant } from '~/lib/invariant';

export const buildSitemapUrls = async () => {
  const schema = await fetchSchema();
  invariant(schema.properties);

  return Object.keys(schema.properties)
    .map((entity) => entity.replace(/_/g, '-'))
    .map((entitySlug) => `/docs/content-management-api/resources/${entitySlug}`);
};
