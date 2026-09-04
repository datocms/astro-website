/**
 * Cloudflare Turnstile — script loader and typings (browser side).
 *
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 *
 * `api.js` is loaded with `render=explicit`, so nothing happens until a form
 * asks for a widget: the script is fetched lazily on pages that host a form,
 * not on every page load.
 *
 * A solved widget proves nothing on its own: the token is only meaningful once
 * the action has verified it server-side (see `~/lib/turnstile`). Everything
 * in here is UX, not a security boundary.
 */

import { TURNSTILE_SITE_KEY } from 'astro:env/client';

export type TurnstileRenderOptions = {
  sitekey: string;
  /** Custom label surfaced in the Turnstile analytics dashboard, ie. `contact`. */
  action?: string;
  theme?: 'auto' | 'light' | 'dark';
  size?: 'normal' | 'flexible' | 'compact';
  /** `execute` defers the challenge until `turnstile.execute()` is called. */
  execution?: 'render' | 'execute';
  /** `interaction-only` keeps the widget invisible unless the visitor must act. */
  appearance?: 'always' | 'execute' | 'interaction-only';
  /** Invoked with the token once the challenge is solved. */
  callback?: (token: string) => void;
  /**
   * Return `true` to tell Turnstile the error was handled — otherwise it also
   * logs a warning with the error code to the console.
   */
  'error-callback'?: (errorCode: string) => boolean;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
};

export type TurnstileApi = {
  render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (container: string | HTMLElement, options?: TurnstileRenderOptions) => void;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
  isExpired: (widgetId?: string) => boolean;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __onTurnstileLoad?: () => void;
  }
}

/**
 * Cloudflare's "always passes" dummy sitekey. It is accepted on any domain,
 * localhost included, so the widget stays functional in development without
 * provisioning real keys. See
 * https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
const TEST_SITE_KEY = '1x00000000000000000000AA';

/**
 * `undefined` when no sitekey is configured for the environment: callers are
 * expected to skip the challenge rather than block submissions on a missing
 * env var. The server side is what actually enforces the check.
 */
export const turnstileSiteKey: string | undefined =
  TURNSTILE_SITE_KEY || (import.meta.env.DEV ? TEST_SITE_KEY : undefined);

const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onTurnstileLoad';

let pendingLoad: Promise<TurnstileApi> | undefined;

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  pendingLoad = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');

    window.__onTurnstileLoad = () => {
      // The onload callback only fires once `window.turnstile` is populated.
      resolve(window.turnstile!);
    };

    script.onerror = () => {
      // Let a later attempt retry: a blocked request or a flaky network
      // shouldn't poison the module for the rest of the session.
      pendingLoad = undefined;
      script.remove();
      reject(new Error('Could not load the Cloudflare Turnstile script'));
    };

    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  });

  return pendingLoad;
}

const widgetsByContainer = new WeakMap<HTMLElement, string>();

/**
 * One-shot helper for the non-React forms: renders an invisible
 * (`interaction-only`) widget inside `container`, runs the challenge and
 * resolves with the token. Any widget left in the container by a previous
 * call is torn down first, since tokens are single-use.
 *
 * Resolves with `''` when no sitekey is configured for the environment.
 */
export async function solveTurnstile(container: HTMLElement, action: string): Promise<string> {
  const sitekey = turnstileSiteKey;

  if (!sitekey) {
    return '';
  }

  const turnstile = await loadTurnstile();

  return new Promise<string>((resolve, reject) => {
    const previous = widgetsByContainer.get(container);

    if (previous) {
      turnstile.remove(previous);
    }

    const widgetId = turnstile.render(container, {
      sitekey,
      action,
      theme: 'light',
      size: 'flexible',
      execution: 'execute',
      appearance: 'interaction-only',
      callback: resolve,
      'error-callback'(errorCode) {
        reject(new Error(`The anti-bot check failed (${errorCode}). Please reload and try again.`));
        return true;
      },
      'timeout-callback'() {
        reject(new Error('The anti-bot check timed out. Please try again.'));
      },
    });

    widgetsByContainer.set(container, widgetId);
    turnstile.execute(container);
  });
}
