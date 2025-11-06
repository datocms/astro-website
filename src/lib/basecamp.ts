import {
  BASECAMP_ACCOUNT_ID,
  BASECAMP_CLIENT_ID,
  BASECAMP_CLIENT_SECRET,
  BASECAMP_REFRESH_TOKEN,
  BASECAMP_USER_AGENT,
} from 'astro:env/server';
import { buildClient, getBearerToken } from 'basecamp-client';

export default async function buildBasecampClient() {
  const bearerToken = await getBearerToken({
    clientId: BASECAMP_CLIENT_ID,
    clientSecret: BASECAMP_CLIENT_SECRET,
    refreshToken: BASECAMP_REFRESH_TOKEN,
    userAgent: BASECAMP_USER_AGENT,
  });

  const client = buildClient({
    bearerToken: bearerToken,
    accountId: BASECAMP_ACCOUNT_ID,
    userAgent: BASECAMP_USER_AGENT,
  });

  return client;
}
