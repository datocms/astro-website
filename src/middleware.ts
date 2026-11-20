import { stripStega } from '@datocms/astro';
import type { MiddlewareHandler } from 'astro';
import { DEPLOYMENT_DESTINATION, SECRET_API_TOKEN } from 'astro:env/server';
import { sequence } from 'astro:middleware';
import { parse } from 'node-html-parser';
import { baseUrl, isDraftModeEnabled } from './lib/draftMode';
import { convertHtmlToMarkdown } from './lib/llmtxt';
import logToRollbar from './lib/logToRollbar';
import apiCatalog from './documents/well-known/api-catalog.json?raw';
import mcpServerCard from './documents/well-known/mcp.json?raw';
import agentSkillsIndex from './documents/well-known/agent-skills/index.json?raw';
import authMarkdown from './documents/well-known/auth.md?raw';

export const rollbar: MiddlewareHandler = async ({ request, params }, next) => {
  try {
    return await next();
  } catch (e) {
    logToRollbar(e, { request, context: { params } });
    throw e;
  }
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/*
 * The bridge from the headers of the origin to the cache of Astro.
 *
 * `executeQuery` and the data sources write the tags of a response in the
 * header `datocms-cache-tags` (`~/lib/surrogateKeys`). This step gives them
 * to `cache.set()`, and the cache provider of the adapter writes the headers
 * of the host (`Cache-Tag` on Cloudflare).
 *
 * Astro writes the cache headers when the middleware returns. A page streams,
 * thus a query in a layout or in a component runs after that moment and its
 * tags are lost. Reading the body first makes all the queries run.
 */
export const cacheTags: MiddlewareHandler = async (context, next) => {
  let response = await next();

  if ((response.headers.get('content-type') || '').includes('text/html')) {
    response = new Response(await response.arrayBuffer(), response);
  }

  const tags = response.headers.get('datocms-cache-tags');
  response.headers.delete('surrogate-key');
  response.headers.delete('surrogate-control');

  if (isDraftModeEnabled(context.request) || response.status >= 500) {
    context.cache.set(false);
    return response;
  }

  if (tags) {
    context.cache.set({ maxAge: ONE_YEAR, swr: 60, tags: tags.split(' ') });
  }

  return response;
};

const wellKnownFiles: Record<string, { body: string; contentType: string }> = {
  '/.well-known/api-catalog': { body: apiCatalog, contentType: 'application/linkset+json' },
  '/.well-known/mcp.json': { body: mcpServerCard, contentType: 'application/json' },
  '/.well-known/agent-skills/index.json': {
    body: agentSkillsIndex,
    contentType: 'application/json',
  },
  '/.well-known/auth.md': { body: authMarkdown, contentType: 'text/markdown; charset=utf-8' },
};

export const wellKnown: MiddlewareHandler = ({ url }, next) => {
  const file = wellKnownFiles[url.pathname];
  if (!file) return next();

  const headers = new Headers({
    'Content-Type': file.contentType,
    'Surrogate-Control': 'max-age=31536000',
  });

  // RFC 9727 §2: HEAD must include Link headers for catalog discovery.
  // §4.2: Linkset representing an API catalog SHOULD declare the profile.
  if (url.pathname === '/.well-known/api-catalog') {
    headers.set(
      'Content-Type',
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    headers.append(
      'Link',
      '</.well-known/api-catalog>; rel="self"; type="application/linkset+json"',
    );
  }

  return new Response(file.body, { headers });
};

export const security: MiddlewareHandler = async (_context, next) => {
  const response = await next();

  response.headers.set('strict-transport-security', 'max-age=63072000; includeSubdomains; preload');
  response.headers.set(
    'content-security-policy',
    'frame-ancestors https://datocms.admin.datocms.com https://cms.datocms.com https://plugins-cdn.datocms.com http://localhost:3002 http://localhost:3000',
  );

  // ronak: point agents at our machine-readable resources
  if ((response.headers.get('content-type') || '').includes('text/html')) {
    response.headers.append('link', '</sitemap.xml>; rel="sitemap"; type="application/xml"');
    response.headers.append('link', '</.well-known/api-catalog>; rel="api-catalog"');
  }

  return response;
};

const routesWithNoAuth = [
  '/up',
  '/landing-pages/cookieConsent.js',
  '/_image',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
];

// The pages preload the fonts without the token. If a font needs auth, the
// browser shows a login prompt on a page that has a correct token.
const prefixesWithNoAuth = ['/fonts/'];

export const basicAuth: MiddlewareHandler = (context, next) => {
  if (
    routesWithNoAuth.includes(context.url.pathname) ||
    prefixesWithNoAuth.some((prefix) => context.url.pathname.startsWith(prefix)) ||
    DEPLOYMENT_DESTINATION === 'development' ||
    !isDraftModeEnabled(context.request)
  ) {
    return next();
  }

  const basicAuth = context.request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];

    if (authValue) {
      const [user, pwd] = Buffer.from(authValue, 'base64').toString('utf-8').split(':');

      if (user === 'dato' && pwd === SECRET_API_TOKEN) {
        return next();
      }
    }
  } else if (context.url.searchParams.get('token') === SECRET_API_TOKEN) {
    return next();
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-authenticate': 'Basic realm="Secure Area"',
    },
  });
};

export const markdownProxy: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname;

  // Check if the request is for a .md version (llmstxt.org spec)
  // Handles both /page.html.md and /index.html.md patterns
  if (pathname.endsWith('.md')) {
    try {
      // Remove the .md extension to get the path of the HTML page
      const htmlPathPlusSearch = pathname.slice(0, -3) + context.url.search;
      const htmlUrl = new URL(htmlPathPlusSearch, baseUrl(context.request));

      // Render the HTML page in this same request, with no fetch. A Worker
      // that fetches its own hostname does not reach itself.
      const htmlResponse = await next(htmlPathPlusSearch);

      // Only an HTML page has a Markdown version
      const contentType = htmlResponse.headers.get('content-type') || '';
      if (!htmlResponse.ok || !contentType.includes('text/html')) {
        return htmlResponse.ok ? new Response('Not found', { status: 404 }) : htmlResponse;
      }

      // Get the HTML content
      const htmlContent = await htmlResponse.text();

      // Convert HTML to Markdown
      const markdown = convertHtmlToMarkdown(stripStega(htmlContent), htmlUrl.href);

      // Copy cache-related headers from the HTML response
      const headers = new Headers({ 'Content-Type': 'text/markdown; charset=utf-8' });

      const headersToCopy = ['cache-control', 'datocms-cache-tags', 'surrogate-control'];
      for (const header of headersToCopy) {
        const value = htmlResponse.headers.get(header);
        if (value) {
          headers.set(header, value);
        }
      }

      return new Response(markdown, {
        status: 200,
        headers,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response(`Error converting to markdown: ${errorMessage}`, {
        status: 500,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }
  }

  // Not a .md request, continue with normal flow
  return next();
};

export const contentNegotiation: MiddlewareHandler = async (context, next) => {
  const accept = context.request.headers.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');

  const response = await next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  // Tell Fastly to cache separate versions per Accept value
  response.headers.append('vary', 'Accept');

  if (!wantsMarkdown) {
    return response;
  }

  const htmlContent = await response.text();
  const markdown = convertHtmlToMarkdown(stripStega(htmlContent), context.url.href);

  const headers = new Headers({ 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' });

  for (const header of ['cache-control', 'datocms-cache-tags', 'surrogate-control']) {
    const value = response.headers.get(header);
    if (value) headers.set(header, value);
  }

  return new Response(markdown, { status: 200, headers });
};

export const propagateToken: MiddlewareHandler = async (context, next) => {
  const token = context.url.searchParams.get('token');
  if (!token) return next();

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const root = parse(html);
  const origin = context.url.origin;

  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href) continue;
    if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;

    try {
      const url = new URL(href, context.url);
      if (url.origin !== origin) continue;
      if (url.searchParams.has('token')) continue;
      url.searchParams.set('token', token);
      const isRelative = !/^https?:\/\//i.test(href);
      a.setAttribute('href', isRelative ? url.pathname + url.search + url.hash : url.toString());
    } catch {
      // ignore malformed hrefs
    }
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(root.toString(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const onRequest = sequence(
  rollbar,
  cacheTags,
  wellKnown,
  markdownProxy,
  security,
  basicAuth,
  propagateToken,
  contentNegotiation,
);
