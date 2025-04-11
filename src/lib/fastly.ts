import { FASTLY_KEY, FASTLY_SERVICE_ID } from 'astro:env/server';
import ky from 'ky';
import { chunk } from 'lodash-es';

export async function invalidateFastlySurrogateKeys(keys: string[]) {
  const responses = [];

  for (const chunkKeys of chunk(keys, 256)) {
    const response = await ky
      .post(`https://api.fastly.com/service/${FASTLY_SERVICE_ID}/purge`, {
        headers: {
          'fastly-key': FASTLY_KEY,
          // required for stale-while-revalidate to work
          'fastly-soft-purge': '1',
        },
        json: { surrogate_keys: chunkKeys },
      })
      .json();

    responses.push(response);
  }

  return responses;
}
