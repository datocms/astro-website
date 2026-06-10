import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
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
    email: z.string(),
    companyName: z.string(),
    companyUrl: z.preprocess((v) => v ?? '', z.string()),
    currentCms: z.string(),
    country: z.string(),
    body: z.string(),
    token: z.string(),
  }),
  handler: async ({ token, ...input }) => {
    try {
      if (!(await isRecaptchaTokenValid(token))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid recaptcha token',
        });
      }

      if (await isSpam(input, ['currentCms', 'country'])) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Your submission was flagged as spam',
        });
      }

      const organization = await findOrCreateOrgByName(
        input.companyName,
        'Technology',
        input.companyUrl,
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

      const lead = await createLead(person, organization, 'Contentful Migration Campaign', []);

      const noteText = [
        '<p><strong>[CONTENTFUL MIGRATION CAMPAIGN]</strong></p>',
        `<p>Current CMS: ${input.currentCms}</p>`,
        `<p>Company website: ${input.companyUrl || '—'}</p>`,
        `<p>Message: ${input.body}</p>`,
      ].join('');

      await createNote(lead, noteText);

      return '/lp/migcs/thanks';
    } catch (e) {
      if (!(e instanceof ActionError)) {
        logErrorToRollbar(e, { context: { action: 'forms.submitMigcsRequest', input } });
      }
      throw e;
    }
  },
});
