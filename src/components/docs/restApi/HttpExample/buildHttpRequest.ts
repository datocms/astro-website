import type { HttpExampleFetchRequest } from './buildFetchRequest';

export function buildHttpRequest({ url, ...requestInit }: HttpExampleFetchRequest): string {
  let result = `${requestInit.method || 'GET'} ${url} HTTP/1.1`;

  if (requestInit.headers) {
    result += '\n';

    result += Object.entries(requestInit.headers)
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n');
  }

  if (requestInit.body) {
    const body =
      typeof requestInit.body === 'string'
        ? requestInit.body
        : JSON.stringify(requestInit.body, null, 2);

    result += `\n\n${body}`;
  }

  return result;
}
