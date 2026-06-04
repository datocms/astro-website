import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_PARTNER_PROGRAM } from 'astro:env/server';
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
  partnershipLabel,
} from '../pipedrive/utils';

const LINKEDIN_CONVERSION_RULE_PARTNER_LEAD = '27784882';

export default defineAction({
  accept: 'form',
  input: z.object({
    firstName: z.string(),
    lastName: z.string(),
    agencyName: z.string(),
    agencyUrl: z.string(),
    teamSize: z.string(),
    productFamiliarity: z.string(),
    email: z.string(),
    country: z.string(),
    body: z.string(),
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

      if (await isSpam(input, ['teamSize', 'productFamiliarity', 'country'])) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Your submission was flagged as spam',
        });
      }

      // Side-effects with no Pipedrive dependency — kick off in parallel with the Pipedrive chain
      const linkedinPromise = hasMarketingConsent(request, cookies)
        ? trackConversion(LINKEDIN_CONVERSION_RULE_PARTNER_LEAD, input.email).catch((e) =>
            logErrorToRollbar(e, { context: { action: 'linkedin.trackConversion.partner' } }),
          )
        : Promise.resolve();

      const frontPromise = sendToFrontChannel(
        FRONT_CHANNEL_URL_PARTNER_PROGRAM,
        input,
        'https://www.datocms.com/partner-program',
      );

      const organization = await findOrCreateOrgByName(
        input.agencyName,
        'Agency / Freelancer',
        input.agencyUrl,
      );
      const person = await findOrCreatePerson(
        input.email,
        input.firstName,
        input.lastName,
        input.country,
        '',
        '',
        organization,
      );
      const lead = await createLead(person, organization, '', [partnershipLabel]);

      const noteText = `<p>Team size: ${input.teamSize}</p><p>Product familiarity: ${input.productFamiliarity}</p><p>Message: ${input.body}</p>`;
      const [, redirectUrl] = await Promise.all([
        createNote(lead, noteText),
        frontPromise,
        linkedinPromise,
      ]);

      return redirectUrl;
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'forms.submitPartnerProgramRequest', input } });
      throw e;
    }
  },
});
