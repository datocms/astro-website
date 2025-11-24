import { DEPLOYMENT_DESTINATION } from 'astro:env/server';

const DASHBOARD_BASE_URL =
  DEPLOYMENT_DESTINATION === 'staging'
    ? 'https://dashboard.staging-datocms.com'
    : 'https://dashboard.datocms.com';

export function dashboardUrl(path: string = '/'): string {
  return new URL(path || '/', DASHBOARD_BASE_URL).toString();
}
