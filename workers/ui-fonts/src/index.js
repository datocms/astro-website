// Serves the UI fonts of DatoCMS out of the private `datocms-ui-fonts` R2
// bucket. The font licences do not allow the files in a public repository,
// thus they live only in the bucket. www.datocms.com streams them through
// `src/pages/fonts/` (see `src/lib/serveUiFont.ts`).

// Only these keys are served. A file in the bucket that is not here stays
// private.
const FILES = new Set(['ABCOracleVariable.woff2']);

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
