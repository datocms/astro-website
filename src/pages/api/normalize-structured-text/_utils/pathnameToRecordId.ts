import { buildSitemapUrls as buildEndpointUrls } from '~/pages/docs/content-management-api/resources/[entitySlug]/[endpointRel]/_graphql';
import { buildSitemapUrls as buildEntityUrls } from '~/pages/docs/content-management-api/resources/[entitySlug]/_graphql';
import { routesWithNoParams, routesWithParams } from './routes.json';

const allParamsToRecordIds = import.meta.glob<ParamsToRecordIdFn>('../../../**/_graphql.ts', {
  import: 'paramsToRecordId',
  eager: false,
});

export type ParamsToRecordIdFn<Params = unknown> = (ctx: {
  executeQueryOptions: {
    request: Request;
    responseHeaders: Headers;
  };
  params: Params;
}) => Promise<string | undefined>;

type ParamsToRecordIdResult =
  | {
      result: 'staticRoute';
    }
  | {
      result: 'invalidParams';
    }
  | {
      result: 'invalidPathname';
    }
  | {
      result: 'recordFound';
      recordId: string;
    };

export async function paramsToRecordId(
  pathname: string,
  request: Request,
): Promise<ParamsToRecordIdResult> {
  const responseHeaders = new Headers();
  const executeQueryOptions = { request, responseHeaders };

  const cmaRoutes = await Promise.all([
    buildEndpointUrls(executeQueryOptions),
    buildEntityUrls(executeQueryOptions),
  ]);

  const isKnownRoute = [...routesWithNoParams, ...cmaRoutes.flat()].includes(pathname);

  for (const route of routesWithParams) {
    const parts = route.pattern.match(/\/(.*)\/(.*)?/)!;
    const matches = pathname.match(new RegExp(parts[1]!, parts[2] || ''));

    if (matches) {
      const params: Record<string, string> = {};
      for (const [index, param] of route.params.entries()) {
        params[param.replace('...', '')] = matches[index + 1]!;
      }

      const ParamsToRecordIdFnPromise = allParamsToRecordIds[route.entrypoint];

      if (!ParamsToRecordIdFnPromise) {
        throw new Error('Missing route');
      }

      const paramsToRecordId = await ParamsToRecordIdFnPromise();

      if (!paramsToRecordId) {
        throw new Error('Missing missingParamsToRecordId');
      }

      try {
        const recordId = await paramsToRecordId({
          executeQueryOptions,
          params,
        });

        if (recordId) {
          return { result: 'recordFound', recordId };
        } else if (!isKnownRoute) {
          return { result: 'invalidParams' };
        }
      } catch (e) {
        if (!isKnownRoute) {
          throw e;
        }
      }
    }
  }

  if (isKnownRoute) {
    return { result: 'staticRoute' };
  }

  return { result: 'invalidPathname' };
}
