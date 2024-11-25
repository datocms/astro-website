import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import logToRollbar from '~/lib/logToRollbar';
import { isRecaptchaTokenValid } from '~/lib/recaptcha';
import { createLead, createNote, findOrCreateOrgByName, findOrCreatePerson } from './utils';

export default defineAction({
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
  handler: async (input) => {
    try {
      if (!(await isRecaptchaTokenValid(input.token))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid recaptcha token',
        });
      }

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

      const partnershipLabel = '87a60c60-6a8e-11ed-92ec-410445a67487';
      const lead = await createLead(person, organization, '', [partnershipLabel]);

      const noteText = `<p>Team size: ${input.teamSize}</p><p>Product familiarity: ${input.productFamiliarity}</p><p>Message: ${input.body}</p>`;

      await createNote(lead, noteText);

      return { success: true };
    } catch (e) {
      logToRollbar(e, { context: { action: 'pipedrive.createPartnerProgramLead', input } });

      throw e;
    }
  },
});
