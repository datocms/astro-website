/**
 * Server-side validation of Cloudflare Turnstile tokens.
 *
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Mirrors the policy of `Cloudflare::Turnstile` + `VerifiesCaptcha` in the API:
 *
 * - no secret key configured → the check is off for that environment;
 * - Cloudflare rejects the token → the submission is rejected;
 * - Cloudflare cannot be reached, or reports an `internal-error` → we fail
 *   *open* and log it, so an outage on challenges.cloudflare.com doesn't take
 *   the forms down with it.
 */

import { TURNSTILE_SECRET_KEY } from 'astro:env/server';
import ky from 'ky';
import logToRollbar from './logToRollbar';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Cloudflare's "always passes" dummy secret, the counterpart of the test
 * sitekey used by `~/lib/loadTurnstile` in development.
 */
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

// Turnstile tokens are never longer than this, so anything bigger is junk we
// can reject without bothering Cloudflare.
const MAX_TOKEN_LENGTH = 2048;

type SiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  metadata?: { result_with_testing_key?: boolean };
};

type Options = {
  /**
   * The `action` the widget was rendered with. A token solved for a different
   * form (or none) is rejected, so a token harvested from one page can't be
   * replayed on another.
   */
  action: string;
};

function secretKey(): string | undefined {
  return TURNSTILE_SECRET_KEY || (import.meta.env.DEV ? TEST_SECRET_KEY : undefined);
}

export async function isTurnstileTokenValid(
  token: string | undefined,
  { action }: Options,
): Promise<boolean> {
  const secret = secretKey();

  if (!secret) {
    return true;
  }

  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return false;
  }

  let result: SiteverifyResponse;

  try {
    result = await ky
      .post(SITEVERIFY_URL, {
        body: new URLSearchParams({ secret, response: token }),
      })
      .json<SiteverifyResponse>();
  } catch (e) {
    logToRollbar(e, { context: { action: 'turnstile.verify', formAction: action } });
    return true;
  }

  const errorCodes = result['error-codes'] ?? [];

  // `internal-error` is Cloudflare telling us it broke, not the visitor
  // failing the challenge.
  if (errorCodes.includes('internal-error')) {
    logToRollbar('Turnstile verification unavailable, letting submission through', {
      context: { action: 'turnstile.verify', formAction: action, errorCodes },
    });
    return true;
  }

  if (!result.success) {
    return false;
  }

  // Cloudflare's dummy testing keys never echo the action back, so the check
  // would reject every submission made in development.
  if (!result.metadata?.result_with_testing_key && result.action !== action) {
    logToRollbar('Turnstile token solved for a different action', {
      context: { action: 'turnstile.verify', formAction: action, tokenAction: result.action },
    });
    return false;
  }

  return true;
}
