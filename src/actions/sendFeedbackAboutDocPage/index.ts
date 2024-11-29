import { buildClient } from '@datocms/cma-client';
import { ActionError, defineAction } from 'astro:actions';
import { DATOCMS_API_TOKEN } from 'astro:env/server';
import { z } from 'astro:schema';
import logToRollbar from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';

export default defineAction({
  accept: 'form',
  input: z.object({
    namespace: z.literal('docs'),
    url: z.string(),
    reaction: z.enum(['positive', 'negative']),
    notes: z.string().optional(),
    email: z.string().email().optional(),
    token: z.string(),
  }),
  handler: async (input) => {
    const { url, reaction, notes, email, token } = input;

    try {
      if (!(await isRecaptchaTokenValid(token))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid recaptcha token',
        });
      }

      const client = buildClient({ apiToken: DATOCMS_API_TOKEN });

      await client.items.create({
        url,
        positive_reaction: reaction === 'positive',
        notes,
        email,
        item_type: { id: 'dAVknVWrSCuheQ6Da9v0kQ', type: 'item_type' },
      });

      return { success: true };
    } catch (e) {
      logToRollbar(e, { context: { action: 'sendFeedbackAboutDocPage', input } });

      throw e;
    }
  },
});
