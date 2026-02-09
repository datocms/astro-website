import { fetchDashboardSchema } from '~/components/docs/dashboardApi/fetchSchema';
import { invariant } from '~/lib/invariant';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn, SitemapEntry } from '~/pages/sitemap.xml';

export const buildSitemapUrls: BuildSitemapUrlsFn = async (ctx) => {
  const schema = await fetchDashboardSchema(ctx);
  invariant(schema.properties);

  return Object.keys(schema.properties)
    .map((entity) => entity.replace(/_/g, '-'))
    .map((entitySlug): SitemapEntry => ({ url: `/docs/dashboard-api/resources/${entitySlug}` }));
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async () => undefined;
