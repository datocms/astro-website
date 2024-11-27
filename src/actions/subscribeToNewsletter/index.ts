import Mailerlite from '@mailerlite/mailerlite-nodejs';
import { defineAction } from 'astro:actions';
import { MAILERLITE_TOKEN } from 'astro:env/server';
import { z } from 'astro:schema';
import { format } from 'date-fns';
import logToRollbar from '~/lib/logToRollbar';

export default defineAction({
  accept: 'form',
  input: z.object({
    email: z
      .string({ invalid_type_error: 'Please, enter your email! 😊' })
      .email('Please, enter a valid email! 😊'),
  }),
  handler: async (input) => {
    const { email } = input;

    try {
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
      logToRollbar(e, { context: { action: 'subscribeToNewsletter', input } });

      throw e;
    }
  },
});
