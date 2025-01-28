import ky from 'ky';
import { dataSource } from '~/lib/dataSource';

export const [fetchErrorCodes, maybeInvalidateSiteApiErrorCodes] = dataSource(
  'site-api-errors',
  async () => {
    return await ky<Record<string, string>>(
      'https://site-api.datocms.com/docs/site-api-errors.json',
    ).json();
  },
);
