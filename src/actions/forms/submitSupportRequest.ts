import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_SUPPORT } from 'astro:env/server';
import { z } from 'astro:schema';
import { sendToFrontChannel } from '~/lib/front';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isTurnstileTokenValid } from '~/lib/turnstile';
import { isSpam } from '~/lib/spam';

export default defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    project: z.string(),
    subject: z.string().optional(),
    body: z.string(),
    errorId: z.string().optional(),
    uploads: z.instanceof(File).array().optional(),
    issueType: z.string().optional(),
    // Empty when no Turnstile sitekey is configured for the environment; the
    // verifier decides whether that is acceptable.
    token: z.string().optional(),
  }),
  handler: async ({ token, ...input }) => {
    try {
      // Step 1: Validate Turnstile token
      if (!(await isTurnstileTokenValid(token, { action: 'support' }))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid anti-bot token',
        });
      }

      if (await isSpam(input, [])) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Your submission was flagged as spam',
        });
      }

      // Step 4: Send to Front webhook (no Pipedrive for support requests)
      const redirectUrl = await sendToFrontChannel(
        FRONT_CHANNEL_URL_SUPPORT,
        input,
        'https://www.datocms.com/support',
      );

      return redirectUrl;
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'forms.submitSupportRequest', input } });
      throw e;
    }
  },
});
