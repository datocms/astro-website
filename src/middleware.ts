import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  response.headers.set('strict-transport-security', 'max-age=63072000; includeSubdomains; preload');
  response.headers.set(
    'content-security-policy',
    'frame-ancestors datocms.admin.datocms.com cms.datocms.com localhost:3002 localhost:3000 plugins-cdn.datocms.com',
  );

  return response;
});
