import { defineAction } from 'astro:actions';
import ky from 'ky';

export default defineAction({
  handler: async () => {
    return await ky('https://api.fastly.com/datacenters', {
      headers: {
        'Fastly-Key': process.env.FASTLY_API_KEY,
      },
    }).json();
  },
});
