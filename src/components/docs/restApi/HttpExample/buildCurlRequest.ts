import type { HttpExampleFetchRequest } from './buildFetchRequest';

function generateMethod(request: HttpExampleFetchRequest) {
  if (request.method === 'GET') return '';
  return `-X ${request.method}`;
}

function generateHeaders({ headers }: HttpExampleFetchRequest) {
  return Object.entries(headers).map(
    ([name, value]) => `-H "${name}: ${`${value}`.replace(/(\\|")/g, '\\$1')}"`,
  );
}

export function escapeBody(body: string) {
  return body.replace(/'/g, `'\\''`);
}

function generateBody({ body }: HttpExampleFetchRequest) {
  if (!body) return [];

  if (typeof body === 'string') {
    return [`--data-binary '${escapeBody(body)}'`];
  }

  return [`--data-binary '${escapeBody(JSON.stringify(body))}'`];
}

export function generateCompress(isEncode: boolean) {
  return isEncode ? ' --compressed' : '';
}

export function buildCurlRequest(request: HttpExampleFetchRequest) {
  let lines = [
    `curl -g '${request.url}'`,
    generateMethod(request),
    ...generateHeaders(request),
    ...generateBody(request),
  ];

  return lines.join(' \\\n  ');
}
