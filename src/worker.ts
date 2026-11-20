import { handle } from '@astrojs/cloudflare/handler';

type Env = { SECRET_API_TOKEN: string };

type ExecutionContext = { waitUntil(promise: Promise<unknown>): void };

type IncomingRequest = Request & { cf?: { country?: string } };

/*
 * The cookie banner and the forms read the country of the visitor from
 * `CF-IPCountry` (`~/lib/consent`). The zone does not always add that header,
 * thus the Worker writes it from `request.cf`. It also replaces a value that
 * the client sends.
 */
function withCountry(request: IncomingRequest) {
  const headers = new Headers(request.headers);
  headers.delete('cf-ipcountry');
  const country = request.cf?.country;
  if (country) {
    headers.set('cf-ipcountry', country);
  }
  return new Request(request, { headers });
}

export default {
  fetch(request: IncomingRequest, env: unknown, context: ExecutionContext) {
    return handle(withCountry(request), env as never, context as never);
  },

  // The cron trigger of `wrangler.jsonc` calls the endpoint that purges the
  // pages of the data sources that changed. The request does not go on the
  // network: the Worker gives it to its own handler.
  async scheduled(_controller: unknown, env: Env, context: ExecutionContext) {
    const url = new URL('https://cron.invalid/api/data-sources-invalidate');
    url.searchParams.set('token', env.SECRET_API_TOKEN);

    context.waitUntil(
      handle(new Request(url, { method: 'POST' }), env as never, context as never).then(
        async (response) => {
          const body = await response.text();
          if (!response.ok) {
            throw new Error(`The data sources cron failed: HTTP ${response.status} ${body}`);
          }
          console.log(`The data sources cron: ${body}`);
        },
      ),
    );
  },
};
