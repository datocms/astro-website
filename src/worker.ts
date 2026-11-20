import { handle } from '@astrojs/cloudflare/handler';

type Env = { SECRET_API_TOKEN: string };

type ExecutionContext = { waitUntil(promise: Promise<unknown>): void };

export default {
  fetch: handle,

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
