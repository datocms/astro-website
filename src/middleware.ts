import { stripStega } from '@datocms/content-link';
import type { MiddlewareHandler } from 'astro';
import { DEPLOYMENT_DESTINATION, SECRET_API_TOKEN } from 'astro:env/server';
import { sequence } from 'astro:middleware';
import { baseUrl, isDraftModeEnabled } from './lib/draftMode';
import { convertHtmlToMarkdown } from './lib/llmtxt';
import logToRollbar from './lib/logToRollbar';

export const rollbar: MiddlewareHandler = async ({ request, params }, next) => {
  try {
    return await next();
  } catch (e) {
    logToRollbar(e, { request, context: { params } });
    throw e;
  }
};

export const security: MiddlewareHandler = async (_context, next) => {
  const response = await next();

  response.headers.set('strict-transport-security', 'max-age=63072000; includeSubdomains; preload');
  response.headers.set(
    'content-security-policy',
    'frame-ancestors https://datocms.admin.datocms.com https://cms.datocms.com https://plugins-cdn.datocms.com http://localhost:3002 http://localhost:3000',
  );

  return response;
};

const routesWithNoAuth = ['/up', '/landing-pages/cookieConsent.js'];

export const basicAuth: MiddlewareHandler = (context, next) => {
  if (
    routesWithNoAuth.includes(context.url.pathname) ||
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
      // Remove the .md extension to get the original HTML URL
      const htmlPathPlusSearch = pathname.slice(0, -3) + context.url.search;

      // Build the HTML URL with the same origin and search params
      const htmlUrl = new URL(htmlPathPlusSearch, baseUrl(context.request));
      htmlUrl.search = context.url.search;

      // Fetch the HTML version
      const htmlResponse = await fetch(htmlUrl);

      if (!htmlResponse.ok) {
        return next();
      }

      // Check if the response is HTML - only convert HTML to markdown
      const contentType = htmlResponse.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        // Not HTML, skip markdown conversion
        return next();
      }

      // Get the HTML content
      const htmlContent = await htmlResponse.text();

      // Convert HTML to Markdown
      const markdown = convertHtmlToMarkdown(stripStega(htmlContent), htmlUrl.href, {
        includeTitle: false,
        includeSidebar: true,
        preserveTables: true,
      });

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

export const onRequest = sequence(rollbar, markdownProxy, security, basicAuth);
