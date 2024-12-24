import type { APIRoute } from 'astro';
import { handleUnexpectedError, json } from './api/_utils';
import { buildSitemapUrls as cmaResourceEndpointUrls } from './docs/content-management-api/resources/[entitySlug]/[endpointRel]/_graphql';
import { buildSitemapUrls as cmaResourceUrls } from './docs/content-management-api/resources/[entitySlug]/_graphql';

const allAstroFiles = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: false,
});

export type BuildSitemapUrlsFn = (ctx: {
  request: Request;
  responseHeaders: Headers;
}) => Promise<string[]>;

export const fetchHardcodedRoutes = async () => {
  let urlsPromises: Array<Promise<string[]>> = [];

  for (const astroFilePath of Object.keys(allAstroFiles)) {
    if (astroFilePath.includes('_')) {
      continue;
    }

    if (!astroFilePath.includes('[')) {
      const url = astroFilePath.replace('./', '/').replace('.astro', '').replace('/index', '');
      urlsPromises.push(Promise.resolve([url || '/']));
    }
  }

  return (await Promise.all(urlsPromises)).flat();
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const responseHeaders = new Headers();

    const urls = await Promise.all([
      fetchHardcodedRoutes(),
      cmaResourceUrls({ request, responseHeaders }),
      cmaResourceEndpointUrls({ request, responseHeaders }),
    ]);

    return json(urls.flat(), { headers: responseHeaders });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
