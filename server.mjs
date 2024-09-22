import fastifyCompress from '@fastify/compress';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = Fastify({
  logger: true,
});

await app
  .register(fastifyCompress)
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
    immutable: true,
    maxAge: '1y',
  })
  .register(fastifyMiddie);

app.use(async (req, res, next) => {
  ssrHandler(req, res, next);
});

app.setNotFoundHandler((req, res) => {
  if (req.method == 'GET' && !req.originalUrl.startsWith('/api')) {
    return res.code(404).type('text/html').sendFile('404.html');
  } else {
    res.code(404);
    return new Error('Route ' + req.method + ':' + req.originalUrl + ' not found');
  }
});

app.listen({ host: process.env.HOST, port: process.env.PORT || 4321 });
