import { ActionError, defineAction } from 'astro:actions';
import { FRONT_CHANNEL_URL_PARTNER_PROGRAM } from 'astro:env/server';
import { z } from 'astro:schema';
import { sendToFrontChannel } from '~/lib/front';
import { logErrorToRollbar } from '~/lib/logToRollbar';
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
  handler: async ({ token, ...input }) => {
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

      // Step 2: Find or create organization in Pipedrive
      const organization = await findOrCreateOrgByName(
        input.agencyName,
        'Agency / Freelancer',
        input.agencyUrl,
      );

      // Step 3: Find or create person contact in Pipedrive
      const person = await findOrCreatePerson(
        input.email,
        input.firstName,
        input.lastName,
        input.country,
        '',
        '',
        organization,
      );

      // Step 4: Create lead in Pipedrive with partnership label
      const partnershipLabel = '87a60c60-6a8e-11ed-92ec-410445a67487';
      const lead = await createLead(person, organization, '', [partnershipLabel]);

      // Step 5 & 6: Add note to Pipedrive and send to Front channel in parallel
      const noteText = `<p>Team size: ${input.teamSize}</p><p>Product familiarity: ${input.productFamiliarity}</p><p>Message: ${input.body}</p>`;
      const [, redirectUrl] = await Promise.all([
        createNote(lead, noteText),
        sendToFrontChannel(
          FRONT_CHANNEL_URL_PARTNER_PROGRAM,
          input,
          'https://www.datocms.com/partner-program',
        ),
      ]);

      return redirectUrl;
    } catch (e) {
      logErrorToRollbar(e, { context: { action: 'forms.submitPartnerProgramRequest', input } });
      throw e;
    }
  },
});
