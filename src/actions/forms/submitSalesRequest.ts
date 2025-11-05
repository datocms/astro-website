import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_SALES } from 'astro:env/server';
import { z } from 'astro:schema';
import { sendToFrontChannel } from '~/lib/front';
import logToRollbar from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';
import { isSpam } from '~/lib/spam';
import {
  createLead,
  createNote,
  findOrCreateOrgByName,
  findOrCreatePerson,
} from '../pipedrive/utils';

export default defineAction({
  accept: 'form',
  input: z.object({
    companyName: z.string(),
    industry: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    country: z.string(),
    jobFunction: z.string(),
    referral: z.string(),
    useCase: z.string(),
    body: z.string(),
    issueType: z.enum(['sales', 'enterprise']).optional(),
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

      if (await isSpam(input, ['industry', 'country', 'jobFunction', 'useCase', 'referral'])) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Your submission was flagged as spam',
        });
      }

      // Step 2: Find or create organization in Pipedrive
      const organization = await findOrCreateOrgByName(input.companyName, input.industry);

      // Step 3: Find or create person contact in Pipedrive
      const person = await findOrCreatePerson(
        input.email,
        input.firstName,
        input.lastName,
        input.country,
        input.jobFunction,
        input.referral,
        organization,
      );

      // Step 4: Create lead in Pipedrive
      const lead = await createLead(person, organization, input.useCase);

      // Step 5: Add note to Pipedrive with message
      await createNote(lead, input.body);

      // Step 6: Send notification to Front channel
      const redirectUrl = await sendToFrontChannel(
        FRONT_CHANNEL_URL_SALES,
        input,
        'https://www.datocms.com/contact',
      );

      return redirectUrl;
    } catch (e) {
      logToRollbar(e, { context: { action: 'forms.submitSalesRequest', input } });
      throw e;
    }
  },
});
