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
        'Content-Type': 'text/plain',
        'Surrogate-Control': 'max-age=31536000',
      },
    },
  );
};
