import type { APIRoute } from 'astro';
import { DEPLOYMENT_DESTINATION } from 'astro:env/server';
import robotsTxt from '~/documents/robots.txt?raw';
import { isDraftModeEnabled } from '~/lib/draftMode';

const disallowAll = 'User-agent: *\nDisallow: /';

export const GET: APIRoute = async ({ request }) => {
  const draftModeEnabled = isDraftModeEnabled(request);

  return new Response(
    DEPLOYMENT_DESTINATION === 'production' && !draftModeEnabled ? robotsTxt : disallowAll,
    {
      headers: {
        'content-type': 'text/plain',
        'cloudflare-cdn-cache-control': 'max-age=31536000',
      },
    },
  );
};
