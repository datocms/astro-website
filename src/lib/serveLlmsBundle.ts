import { LLMS_BLOB_BASE_URL } from 'astro:env/server';
import { isDefined } from './isDefined';

export async function fetchBlob(filename: string): Promise<string | null> {
  if (!LLMS_BLOB_BASE_URL) return null;
  const upstream = await fetch(`${LLMS_BLOB_BASE_URL}/${filename}`);
  return upstream.ok ? upstream.text() : null;
}

function blobResponse(body: string | null) {
  return new Response(body ?? '', {
    status: body ? 200 : 502,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

/**
 * The llms.txt bundles are generated nightly by the `llms-txt` repo, stored in
 * a private R2 bucket and served back out by its Cloudflare Worker at
 * `llms-txt.datocms.com` (read-only, key-allowlisted). We stream them through
 * this endpoint (rather than redirecting) so the public URLs stay under
 * datocms.com, and we cache aggressively at the CDN so upstream reads happen
 * ~once per day per bundle.
 *
 * Pass a single filename to serve one blob; pass multiple filenames to fetch,
 * concatenate, and return them as one response.
 */
export async function serveLlmsBundle(...filenames: string[]): Promise<Response> {
  const parts = await Promise.all(filenames.map(fetchBlob));
  const available = parts.filter(isDefined);

  if (available.length === 0) {
    return blobResponse(null);
  }

  return blobResponse(available.join('\n\n'));
}
