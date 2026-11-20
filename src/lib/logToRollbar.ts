import { DEPLOYMENT_DESTINATION, ROLLBAR_TOKEN } from 'astro:env/server';

/*
 * Sends an item to Rollbar with `fetch`. The Rollbar SDK for Node sends
 * nothing from a Worker, and it fails silently. `waitUntil` keeps the Worker
 * alive after the response, until the item is sent.
 *
 * The other Workers (try.datocms.com, llms-txt) send the same items. Rollbar
 * discards an item silently when:
 * - the token is not a `post_server_item` token;
 * - `platform` is a client platform (browser, android, ios, flash, client).
 */

type Options = {
  request?: Request;
  context?: Record<string, unknown>;
};

type Level = 'error' | 'warning';

const HIDDEN_HEADERS = ['authorization', 'cookie'];

const HIDDEN_PARAMS = ['token'];

type Frame = { filename: string; lineno?: number; colno?: number; method?: string };

// A line of a V8 stack: `at method (file:line:col)` or `at file:line:col`.
const STACK_LINE = /^\s*at (?:(.+?) \()?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

function framesOf(error: Error): Frame[] {
  const frames = (error.stack ?? '')
    .split('\n')
    .slice(1)
    .map((line) => STACK_LINE.exec(line))
    .filter((match) => match !== null)
    .map(([, method, filename, lineno, colno]) => ({
      filename: filename!,
      method,
      lineno: lineno ? Number(lineno) : undefined,
      colno: colno ? Number(colno) : undefined,
    }));

  // Rollbar wants the most recent call last.
  return frames.reverse();
}

function bodyOf(error: unknown) {
  if (error instanceof Error) {
    return {
      trace: {
        frames: framesOf(error),
        exception: { class: error.name, message: error.message },
      },
    };
  }

  return { message: { body: typeof error === 'string' ? error : JSON.stringify(error) } };
}

function serializeRequest(request: Request) {
  const url = new URL(request.url);
  for (const param of HIDDEN_PARAMS) {
    if (url.searchParams.has(param)) url.searchParams.set(param, '[hidden]');
  }

  const headers = Object.fromEntries(
    [...request.headers].filter(([name]) => !HIDDEN_HEADERS.includes(name.toLowerCase())),
  );

  return { url: url.toString(), method: request.method, headers };
}

async function workerRuntime() {
  try {
    return await import('cloudflare:workers');
  } catch {
    // Outside a Worker (a script, a test), the promise runs to its end.
    return undefined;
  }
}

async function send(level: Level, error: unknown, options: Options) {
  if (!ROLLBAR_TOKEN) {
    return;
  }

  const runtime = await workerRuntime();

  const item = {
    data: {
      environment: DEPLOYMENT_DESTINATION,
      level,
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'server',
      language: 'javascript',
      framework: 'cloudflare-workers',
      code_version: runtime?.env.CF_VERSION_METADATA?.id,
      notifier: { name: 'astro-website' },
      body: bodyOf(error),
      request: options.request ? serializeRequest(options.request) : undefined,
      custom: options.context,
    },
  };

  const sent = fetch('https://api.rollbar.com/api/1/item/', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-rollbar-access-token': ROLLBAR_TOKEN },
    body: JSON.stringify(item),
  })
    .then(async (response) => {
      if (!response.ok) {
        console.error(`Rollbar refused the item: HTTP ${response.status} ${await response.text()}`);
      }
    })
    .catch((sendError) => console.error('Could not send the item to Rollbar', sendError));

  runtime?.waitUntil(sent);
}

export function logErrorToRollbar(error: unknown, options: Options = {}) {
  void send('error', error, options);
}

// An error is an `error` item, a message is a `warning` item.
export default function logToRollbar(error: unknown, options: Options = {}) {
  void send(error instanceof Error ? 'error' : 'warning', error, options);
}
