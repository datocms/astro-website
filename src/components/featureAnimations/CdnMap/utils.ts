import ky from 'ky';
import { dataSource } from '~/lib/dataSource';

type GithubResponse = Record<
  string,
  {
    cca2: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
    name: string;
    region: string;
  }
>;

export const [fetchCloudflareDatacenters, maybeInvalidateCloudflareDatacenters] = dataSource(
  'cloudflare-datacenters',
  async () => {
    const response = await ky<GithubResponse>(
      'https://raw.githubusercontent.com/Netrvin/cloudflare-colo-list/refs/heads/main/DC-Colos.json',
    ).json();

    return Object.entries(response).map(([code, dc]) => ({ ...dc, code }));
  },
);
