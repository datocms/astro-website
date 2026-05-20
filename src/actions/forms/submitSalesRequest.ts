import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_SALES } from 'astro:env/server';
import { z } from 'astro:schema';
import { hasMarketingConsent } from '~/lib/consent';
import { sendToFrontChannel } from '~/lib/front';
import { trackConversion } from '~/lib/linkedin';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';
import { isSpam } from '~/lib/spam';
import {
  createLead,
  createNote,
  findOrCreateOrgByName,
  findOrCreatePerson,
} from '../pipedrive/utils';

const LINKEDIN_CONVERSION_RULE_SALES_LEAD = '27784874';

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
  handler: async ({ token, ...input }, { request, cookies }) => {
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

      // Side-effects with no Pipedrive dependency — kick off in parallel with the Pipedrive chain
      const linkedinPromise = hasMarketingConsent(request, cookies)
        ? trackConversion(LINKEDIN_CONVERSION_RULE_SALES_LEAD, input.email).catch((e) =>
            logErrorToRollbar(e, { context: { action: 'linkedin.trackConversion.sales' } }),
          )
        : Promise.resolve();

      const frontPromise = sendToFrontChannel(
        FRONT_CHANNEL_URL_SALES,
        input,
        'https://www.datocms.com/contact',
      );

      const organization = await findOrCreateOrgByName(input.companyName, input.industry);
      const person = await findOrCreatePerson(
        input.email,
        input.firstName,
        input.lastName,
        input.country,
        input.jobFunction,
        input.referral,
        organization,
      );
      const lead = await createLead(person, organization, input.useCase);

      const [, redirectUrl] = await Promise.all([
        createNote(lead, input.body),
        frontPromise,
        linkedinPromise,
      ]);

      return redirectUrl;
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'forms.submitSalesRequest', input } });
      throw e;
    }
  },
});
