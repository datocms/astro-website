import Mailerlite from '@mailerlite/mailerlite-nodejs';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { format } from 'date-fns';

export default defineAction({
  accept: 'form',
  input: z.object({
    email: z
      .string({ invalid_type_error: 'Please, enter your email! 😊' })
      .email('Please, enter a valid email! 😊'),
  }),
  handler: async ({ email }) => {
    const mailerlite = new Mailerlite({
      api_key: process.env.MAILERLITE_TOKEN!,
    });

    await mailerlite.subscribers.createOrUpdate({
      email: email,
      status: 'active',
      opted_in_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });

    return { success: true };
  },
});
