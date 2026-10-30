import { useCallback, useEffect, useRef } from 'react';
import { loadTurnstile, turnstileSiteKey } from '~/lib/loadTurnstile';

export class TurnstileError extends Error {}

/**
 * Mounts an invisible Cloudflare Turnstile widget in `containerRef` and hands
 * out a `getToken()` that runs the challenge on demand — the same shape the
 * reCAPTCHA v3 flow had: nothing is visible, and the token is produced right
 * when the form is submitted.
 *
 * The widget is rendered with `appearance: 'interaction-only'`, so the only
 * time the visitor sees anything is when Cloudflare isn't sure about them and
 * asks for a click. That is why the container has to sit inside the form
 * layout rather than off-screen.
 *
 * Tokens are single-use and expire after five minutes, so every `getToken()`
 * call resets the widget and solves a fresh one. Don't cache the result.
 *
 * When no sitekey is configured the hook degrades to "no challenge" and
 * resolves with an empty token: the server side is what enforces the check.
 */
export function useTurnstile(action: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const pendingRef = useRef<
    { resolve: (token: string) => void; reject: (error: Error) => void } | undefined
  >(undefined);

  const settle = useCallback((outcome: { token: string } | { error: Error }) => {
    const pending = pendingRef.current;
    pendingRef.current = undefined;

    if (!pending) {
      return;
    }

    if ('token' in outcome) {
      pending.resolve(outcome.token);
    } else {
      pending.reject(outcome.error);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const sitekey = turnstileSiteKey;

    if (!(sitekey && container)) {
      return;
    }

    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) {
          return;
        }

        widgetIdRef.current = turnstile.render(container, {
          sitekey,
          action,
          theme: 'light',
          size: 'flexible',
          execution: 'execute',
          appearance: 'interaction-only',
          callback(token) {
            settle({ token });
          },
          'error-callback'(errorCode) {
            settle({
              error: new TurnstileError(
                `The anti-bot check failed (${errorCode}). Please reload the page and try again.`,
              ),
            });
            return true;
          },
          'expired-callback'() {
            // Only relevant when a token is held for a while: `getToken()`
            // always resets before solving, so there's nothing to do.
          },
          'timeout-callback'() {
            settle({
              error: new TurnstileError(
                'The anti-bot check timed out. Please submit the form again.',
              ),
            });
          },
        });
      })
      .catch(() => {
        // Surfaced later by `getToken()`, at the moment the visitor submits.
      });

    return () => {
      cancelled = true;

      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [action, settle]);

  const getToken = useCallback(async (): Promise<string> => {
    if (!turnstileSiteKey) {
      return '';
    }

    let turnstile;

    try {
      turnstile = await loadTurnstile();
    } catch {
      throw new TurnstileError(
        "The anti-bot check couldn't be loaded. Please check your connection and reload the page.",
      );
    }

    const widgetId = widgetIdRef.current;
    const container = containerRef.current;

    if (!(widgetId && container)) {
      throw new TurnstileError('The anti-bot check is not ready yet. Please try again.');
    }

    return new Promise<string>((resolve, reject) => {
      // A submit racing an earlier one supersedes it.
      settle({ error: new TurnstileError('Superseded by a newer submission') });
      pendingRef.current = { resolve, reject };

      // Per the Cloudflare docs, `execute` addresses the container while the
      // other methods take the widget ID.
      turnstile.reset(widgetId);
      turnstile.execute(container);
    });
  }, [settle]);

  return { containerRef, getToken };
}
