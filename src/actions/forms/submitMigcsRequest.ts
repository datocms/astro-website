import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { hasMarketingConsent } from '~/lib/consent';
import { trackConversion } from '~/lib/linkedin';
import { logErrorToRollbar } from '~/lib/logToRollbar';
import { isTurnstileTokenValid } from '~/lib/turnstile';
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
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    companyName: z.string(),
    companyUrl: z.preprocess((v) => v ?? '', z.string()),
    currentCms: z.string(),
    country: z.string(),
    body: z.string(),
    // Empty when no Turnstile sitekey is configured for the environment; the
    // verifier decides whether that is acceptable.
    token: z.string().optional(),
  }),
  handler: async ({ token, ...input }, { request, cookies }) => {
    try {
      if (!(await isTurnstileTokenValid(token, { action: 'lp-migcs' }))) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid anti-bot token',
        });
      }

      if (await isSpam(input, ['currentCms', 'country'])) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Your submission was flagged as spam',
        });
      }

      const linkedinPromise = hasMarketingConsent(request, cookies)
        ? trackConversion(LINKEDIN_CONVERSION_RULE_SALES_LEAD, input.email).catch((e) =>
            logErrorToRollbar(e, { context: { action: 'linkedin.trackConversion.migcs' } }),
          )
        : Promise.resolve();

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

      await Promise.all([createNote(lead, noteText), linkedinPromise]);

      return '/lp/migcs/thanks';
    } catch (e) {
      if (!(e instanceof ActionError)) {
        logErrorToRollbar(e, { context: { action: 'forms.submitMigcsRequest', input } });
      }
      throw e;
    }
  },
});
