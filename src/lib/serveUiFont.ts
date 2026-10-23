import { UI_FONTS_BASE_URL } from 'astro:env/server';

/**
 * The UI fonts of the DatoCMS product (the cms, the dashboard and the
 * plugins) live in a private R2 bucket, served by the `datocms-ui-fonts`
 * Cloudflare Worker (`workers/ui-fonts/`). The font licences do not allow
 * the files in this public repository.
 *
 * We stream them through datocms.com, thus the URL stays the same if the
 * storage changes. The file name has no version: a new file in the bucket
 * reaches every plugin, also an old one, within a day of CDN cache.
 *
 * The plugins run in frames on other origins, thus the response needs CORS.
 */
export async function serveUiFont(request: Request, filename: string): Promise<Response> {
  if (!UI_FONTS_BASE_URL) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = await fetch(`${UI_FONTS_BASE_URL}/${filename}`);

  if (!upstream.ok || !upstream.body) {
    return new Response('Bad gateway', { status: 502 });
  }

  const etag = upstream.headers.get('ETag');
  const headers = new Headers({
    'Content-Type': 'font/woff2',
    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    'Access-Control-Allow-Origin': '*',
    'Cross-Origin-Resource-Policy': 'cross-origin',
  });

  if (etag) {
    headers.set('ETag', etag);

    if (request.headers.get('If-None-Match') === etag) {
      await upstream.body.cancel();
      return new Response(null, { status: 304, headers });
    }
  }

  return new Response(upstream.body, { headers });
}
