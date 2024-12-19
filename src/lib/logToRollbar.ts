import { DEPLOYMENT_DESTINATION, ROLLBAR_TOKEN } from 'astro:env/server';
import Rollbar from 'rollbar';

const rollbar = new Rollbar({ accessToken: ROLLBAR_TOKEN, environment: DEPLOYMENT_DESTINATION });

type Options = {
  request?: Request;
  context?: Record<string, unknown>;
};

export default function logToRollbar(error: any, options: Options = {}) {
  if (!ROLLBAR_TOKEN) {
    return;
  }

  const serializedRequest = options.request
    ? {
        headers: Object.fromEntries(options.request.headers),
        url: options.request.url,
        method: options.request.method,
      }
    : undefined;

  rollbar.error(error, options.context, serializedRequest);
}
