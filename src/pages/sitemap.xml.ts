import type { APIRoute } from 'astro';
import { SitemapStream, streamToPromise } from 'sitemap';
import { isDraftModeEnabled } from '~/lib/draftMode';

const allAstroFiles = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: false,
});

const allBuildSitemapUrls = import.meta.glob<BuildSitemapUrlsFn>('../pages/**/_graphql.ts', {
  import: 'buildSitemapUrls',
  eager: false,
});

export type BuildSitemapUrlsFn = (ctx: { includeDrafts: boolean }) => Promise<string[]>;

export const fetchSitemapUrls = async (includeDrafts: boolean) => {
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

          const buildSitemapUrlsFnPromise = allBuildSitemapUrls[graphqlPath];

          if (!buildSitemapUrlsFnPromise) {
            throw new Error(`Missing buildSitemapUrls() in ${graphqlPath}`);
          }

          const buildSitemapUrls = await buildSitemapUrlsFnPromise();

          if (!buildSitemapUrls) {
            throw new Error(`Missing buildSitemapUrls() in ${graphqlPath}`);
          }

          return await buildSitemapUrls({ includeDrafts });
        })(),
      );
    } else {
      const url = astroFilePath.replace('./', '/').replace('.astro', '').replace('/index', '');
      urlsPromises.push(Promise.resolve([url]));
    }
  }

  return (await Promise.all(urlsPromises)).flat();
};

export const GET: APIRoute = async (x) => {
  const stream = new SitemapStream({ hostname: 'https://www.datocms.com/' });
  const sitemapPromise = streamToPromise(stream);

  for (const url of await fetchSitemapUrls(isDraftModeEnabled(x.request))) {
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
