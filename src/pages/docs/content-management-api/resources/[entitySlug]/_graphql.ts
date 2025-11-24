import { fetchCmaSchema } from '~/components/docs/cmaApi/fetchSchema';
import { invariant } from '~/lib/invariant';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const buildSitemapUrls: BuildSitemapUrlsFn = async (ctx) => {
  const schema = await fetchCmaSchema(ctx);
  invariant(schema.properties);

  return Object.keys(schema.properties)
    .map((entity) => entity.replace(/_/g, '-'))
    .map((entitySlug) => `/docs/content-management-api/resources/${entitySlug}`);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async () => undefined;
