import { LLMS_BLOB_BASE_URL } from 'astro:env/server';

/**
 * The llms.txt bundles are generated nightly by the `llms-full` repo and stored
 * as public files in a Vercel Blob store. We stream them through this endpoint
 * (rather than redirecting) so the public URLs stay under datocms.com, and we
 * cache aggressively at the CDN so blob reads happen ~once per day per bundle.
 */
export async function serveLlmsBundle(filename: string): Promise<Response> {
  const upstream = await fetch(`${LLMS_BLOB_BASE_URL}/${filename}`);

  if (!upstream.ok) {
    return new Response('', { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
