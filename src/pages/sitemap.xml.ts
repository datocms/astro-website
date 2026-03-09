import type { APIRoute } from 'astro';
import { SitemapStream, streamToPromise } from 'sitemap';
import { baseUrl } from '~/lib/draftMode';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError } from './api/_utils';

const allAstroFiles = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: false,
});

const allBuildSitemapUrls = import.meta.glob<BuildSitemapUrlsFn>('../pages/**/_graphql.ts', {
  import: 'buildSitemapUrls',
  eager: false,
});

export type SitemapItem = { url: string; lastmod?: string };

export type BuildSitemapUrlsFn = (ctx: {
  request: Request;
  responseHeaders: Headers;
}) => Promise<Array<string | SitemapItem>>;

export const fetchSitemapUrls = async (request: Request, responseHeaders: Headers) => {
  let urlsPromises: Array<Promise<Array<string | SitemapItem>>> = [];

  for (const astroFilePath of Object.keys(allAstroFiles)) {
    if (astroFilePath.includes('_')) {
      continue;
    }

    if (astroFilePath.includes('[')) {
      urlsPromises.push(
        (async () => {
          const graphqlPath =
            astroFilePath.replace('.astro', '').replace('/index', '') + '/_graphql.ts';

          const buildSitemapUrlsFnPromise = allBuildSitemapUrls[graphqlPath];

          if (!buildSitemapUrlsFnPromise) {
            throw new Error(`Missing buildSitemapUrls() in ${graphqlPath}`);
          }

          const buildSitemapUrls = await buildSitemapUrlsFnPromise();

          if (!buildSitemapUrls) {
            throw new Error(`Missing buildSitemapUrls() in ${graphqlPath}`);
          }

          return await buildSitemapUrls({ request, responseHeaders });
        })(),
      );
    } else {
      const url = astroFilePath.replace('./', '/').replace('.astro', '').replace('/index', '');
      urlsPromises.push(Promise.resolve([url]));
    }
  }

  return (await Promise.all(urlsPromises)).flat();
};

const BLACKLISTED_URL_PREFIXES = ['/docs/dashboard-api'];

export const GET: APIRoute = async ({ request }) => {
  try {
    const stream = new SitemapStream({ hostname: baseUrl(request) });
    const sitemapPromise = streamToPromise(stream);

    const responseHeaders = new Headers({
      'Content-Type': 'application/xml',
    });

    for (const item of await fetchSitemapUrls(request, responseHeaders)) {
      const url = typeof item === 'string' ? item : item.url;

      if (url === '/404') {
        continue;
      }

      if (BLACKLISTED_URL_PREFIXES.some((prefix) => url.startsWith(prefix))) {
        continue;
      }

      stream.write(typeof item === 'string' ? { url } : item);
    }

    stream.end();

    const sitemap = await sitemapPromise;

    return new Response(toArrayBuffer(sitemap), {
      headers: responseHeaders,
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
