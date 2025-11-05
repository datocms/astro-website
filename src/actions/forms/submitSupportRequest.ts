import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_SUPPORT } from 'astro:env/server';
import { z } from 'astro:schema';
import { sendToFrontChannel } from '~/lib/front';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';
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
    token: z.string(),
  }),
  handler: async ({ token, ...input }) => {
    try {
      // Step 1: Validate reCAPTCHA token
      if (!(await isRecaptchaTokenValid(token))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid recaptcha token',
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
