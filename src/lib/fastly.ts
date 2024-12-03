import { FASTLY_KEY, FASTLY_SERVICE_ID } from 'astro:env/server';
import ky from 'ky';

export async function invalidateFastlySurrogateKeys(keys: string[]) {
  return await ky
    .post(`https://api.fastly.com/service/${FASTLY_SERVICE_ID}/purge`, {
      headers: {
        'fastly-key': FASTLY_KEY,
        // required for stale-while-revalidate to work
        'fastly-soft-purge': '1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ surrogate_keys: keys }),
    })
    .json();
}
