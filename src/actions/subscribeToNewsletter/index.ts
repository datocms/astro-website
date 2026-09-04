import Mailerlite from '@mailerlite/mailerlite-nodejs';
import { ActionError, defineAction } from 'astro:actions';
import { MAILERLITE_TOKEN } from 'astro:env/server';
import { z } from 'astro:schema';
import { format } from 'date-fns';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isTurnstileTokenValid } from '~/lib/turnstile';

export default defineAction({
  accept: 'form',
  input: z.object({
    email: z
      .string({ invalid_type_error: 'Please, enter your email! 😊' })
      .email('Please, enter a valid email! 😊'),
    // Empty when no Turnstile sitekey is configured for the environment; the
    // verifier decides whether that is acceptable.
    token: z.string().optional(),
  }),
  handler: async (input) => {
    const { email, token } = input;

    try {
      if (!(await isTurnstileTokenValid(token, { action: 'newsletter' }))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid anti-bot token',
        });
      }

      const mailerlite = new Mailerlite({
        api_key: MAILERLITE_TOKEN,
      });

      await mailerlite.subscribers.createOrUpdate({
        email: email,
        status: 'active',
        opted_in_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      });

      return { success: true };
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'subscribeToNewsletter', input } });

      throw e;
    }
  },
});
