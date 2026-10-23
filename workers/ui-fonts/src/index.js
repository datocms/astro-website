// Serves the UI fonts of DatoCMS out of the private `datocms-ui-fonts` R2
// bucket. The licence of ABC Oracle does not allow the file in a public
// repository, thus it lives only in the bucket. www.datocms.com streams the
// files through `src/pages/fonts/` (see `src/lib/serveUiFont.ts`).

import { FILES } from './files.js';

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const key = new URL(request.url).pathname.slice(1);

    if (!FILES.has(key)) {
      return new Response('Not found', { status: 404 });
    }

    const object = await env.UI_FONTS.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);

    return new Response(request.method === 'HEAD' ? null : object.body, {
      headers,
    });
  },
};
