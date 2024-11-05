import type { APIRoute } from 'astro';
import { SitemapStream, streamToPromise } from 'sitemap';
import { cachedFn } from '~/lib/temporarlyCache';

const allAstroFiles = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const allBuildSitemapUrls = import.meta.glob<string>('../pages/**/_graphql.ts', {
  import: 'buildSitemapUrls',
  eager: true,
});

export type BuildSitemapUrlsFn = () => Promise<string[]>;

export const fetchSitemapUrls = cachedFn(async () => {
  let urlsPromises: Array<Promise<string[]>> = [];

  for (const astroFilePath of Object.keys(allAstroFiles)) {
    if (astroFilePath.includes('_')) {
      continue;
    }

    if (astroFilePath.includes('[')) {
      urlsPromises.push(
        (async () => {
          const graphqlPath =
            astroFilePath.replace('.astro', '').replace('/index', '') + '/_graphql.ts';

          const buildSitemapUrls = allBuildSitemapUrls[graphqlPath] as
            | BuildSitemapUrlsFn
            | undefined;

          if (!buildSitemapUrls) {
            throw new Error(`Missing buildSitemapUrls() in ${graphqlPath}`);
          }

          return await buildSitemapUrls();
        })(),
      );
    } else {
      const url = astroFilePath.replace('./', '/').replace('.astro', '').replace('/index', '');
      urlsPromises.push(Promise.resolve([url]));
    }
  }

  return (await Promise.all(urlsPromises)).flat();
});

export const GET: APIRoute = async () => {
  const stream = new SitemapStream({ hostname: 'https://www.datocms.com/' });
  const sitemapPromise = streamToPromise(stream);

  for (const url of await fetchSitemapUrls()) {
    if (url === '/404') {
      continue;
    }

    stream.write({ url });
  }

  stream.end();

  const sitemap = await sitemapPromise;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
