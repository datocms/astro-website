import * as prettier from 'prettier';
import type { HttpExampleFetchRequest } from './buildFetchRequest';

export async function buildFetchCodeRequest({
  url,
  ...requestInit
}: HttpExampleFetchRequest): Promise<string> {
  const code = `
    await fetch(
      '${url}',
      {
        ${Object.entries(requestInit)
          .map(([option, value]) => {
            if (option === 'method' && value === 'GET') {
              return null;
            }

            if (option !== 'body') {
              return `${option}: ${JSON.stringify(value)},`;
            }

            if (!value) {
              return null;
            }

            if (typeof value === 'string') {
              return `body: ${JSON.stringify(value)},`;
            }

            return `body: JSON.stringify(${JSON.stringify(value)}),`;
          })
          .filter(Boolean)
          .join('\n')}
      }
    );
  `;

  return prettier.format(code, {
    parser: 'babel',
  });
}
