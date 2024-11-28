import { FASTLY_KEY } from 'astro:env/server';
import ky from 'ky';
import { dataSource } from '~/lib/dataSource';

type DataCenter = {
  code: string;
  name: string;
  group: string;
  region: string;
  stats_region: string;
  billing_region: string;
  coordinates: { x: number; y: number; latitude: number; longitude: number };
  shield: string;
};

export const [fetchFastlyDatacenters, maybeInvalidateFastlyDatacenters] = dataSource(
  'fastly-datacenters',
  () =>
    ky<DataCenter[]>('https://api.fastly.com/datacenters', {
      headers: {
        'Fastly-Key': FASTLY_KEY,
      },
    }).json(),
);
