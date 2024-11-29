import type { HttpExampleFetchResponse } from './buildFetchResponse';

export function buildHttpResponse(response: HttpExampleFetchResponse): string {
  let result = `HTTP/1.1 ${response.statusCode} ${response.statusText}`;

  result += '\n';

  result += Object.entries(response.headers)
    .map(([name, value]) => `${name}: ${value}`)
    .join('\n');

  if (response.body) {
    result += `\n\n${response.body}`;
  }

  return result;
}
