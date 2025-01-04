import type { MiddlewareHandler } from 'astro';
import { DEPLOYMENT_DESTINATION, SECRET_API_TOKEN } from 'astro:env/server';
import { sequence } from 'astro:middleware';
import { isDraftModeEnabled } from './lib/draftMode';
import logToRollbar from './lib/logToRollbar';

export const removeDoubleSlashes: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.includes('//')) {
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    return Response.redirect(url.toString(), 301);
  }

  return next();
};

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
    'frame-ancestors datocms.admin.datocms.com cms.datocms.com localhost:3002 localhost:3000 plugins-cdn.datocms.com',
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

export const onRequest = sequence(removeDoubleSlashes, rollbar, security, basicAuth);
