import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';
import { paramsToRecordId as docsParamsToRecordId } from '../../[...rest]/_graphql';

// Already handled in src/pages/docs/[...rest]/_graphql.ts
export const buildSitemapUrls: BuildSitemapUrlsFn = async () => [];

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  return docsParamsToRecordId({
    executeQueryOptions,
    params: { rest: `dashboard-api/${slug}` },
  });
};
