import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import logToRollbar from '~/lib/logToRollbar';
import { createLead, createNote, findOrCreateOrgByName, findOrCreatePerson } from './utils';

export default defineAction({
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
    token: z.string(),
  }),
  handler: async (input) => {
    try {
      // we cannot validate RECAPTCHA because it's being validated by Front later!
      // we'd need two different tokens :/

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

      await createNote(lead, input.body);

      return { success: true };
    } catch (e) {
      logToRollbar(e, { context: { action: 'createSalesLead', input } });

      throw e;
    }
  },
});
