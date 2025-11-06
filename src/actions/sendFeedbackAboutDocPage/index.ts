import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import buildBasecampClient from '~/lib/basecamp';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';

const SUPPORT_TEAM = 33592869;
const TRIAGE_COLUMN = 9255769099;

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

      const basecamp = await buildBasecampClient();

      await basecamp.cardTableCards.create({
        params: {
          bucketId: SUPPORT_TEAM,
          columnId: TRIAGE_COLUMN,
        },
        body: {
          title:
            reaction === 'positive'
              ? '🏆 Positive feedback received'
              : '🙁 Negative feedback received',
          content: /* HTML */ `
            ${notes}
            <br /><br />
            <ul>
              <li><strong>Where:</strong> https://www.datocms.com${url}</li>
              <li><strong>Email:</strong> ${email || 'N/A'}</li>
            </ul>
          `,
          assignee_ids: [44231845, 44779107], // Support team
        },
      });

      return { success: true };
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'sendFeedbackAboutDocPage', input } });

      throw e;
    }
  },
});
