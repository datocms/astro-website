import { fetchDashboardSchema } from '~/components/docs/dashboardApi/fetchSchema';
import type { RestApiEntity } from '~/components/docs/restApi/types';
import { invariant } from '~/lib/invariant';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const buildSitemapUrls: BuildSitemapUrlsFn = async (ctx) => {
  const schema = await fetchDashboardSchema(ctx);
  invariant(schema.properties);

  return Object.entries(schema.properties).flatMap(([entityName, entitySchema]) => {
    const entitySlug = entityName.replace(/_/g, '-');
    return (entitySchema as RestApiEntity).links!.map(
      (endpoint) => `/docs/dashboard-api/resources/${entitySlug}/${endpoint.rel}`,
    );
  });
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async () => undefined;
