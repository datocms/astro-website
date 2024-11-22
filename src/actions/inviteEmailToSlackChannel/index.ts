import { WebClient } from '@slack/web-api';
import { ActionError, defineAction } from 'astro:actions';
import { RECAPTCHA_SECRET_KEY } from 'astro:env/server';
import { z } from 'astro:schema';
import ky from 'ky';
import logToRollbar from '~/lib/logToRollbar';

interface ErrorResponse {
  data: {
    error: string;
  };
}

function isErrorResponse(e: any): e is ErrorResponse {
  return (
    typeof e === 'object' &&
    e !== null &&
    'data' in e &&
    typeof e.data === 'object' &&
    e.data !== null &&
    'error' in e.data &&
    typeof e.data.error === 'string'
  );
}

const errorLabels: Partial<Record<string, string>> = {
  already_invited: 'You have already been invited! Check for an email from Slack.',
  already_in_team: 'This email is already part of the team!',
  already_in_team_invited_user: 'You have already been invited! Check for an email from Slack.',
};

export default defineAction({
  input: z.object({
    email: z
      .string({ invalid_type_error: 'Please, enter your email! 😊' })
      .email('Please, enter a valid email! 😊'),
    token: z.string(),
  }),
  handler: async (input) => {
    const { email, token } = input;

    const { success } = await ky
      .post<{ success: boolean }>('https://www.google.com/recaptcha/api/siteverify', {
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      })
      .json();

    if (!success) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Invalid recaptcha token',
      });
    }

    const slack = new WebClient(process.env.SLACK_TOKEN);

    try {
      await slack.apiCall('users.admin.invite', {
        email,
        set_active: true,
        channels: [
          'C7SS10UUW', // general
          'CDP0ERYJE', // graphql
          'CDQC7RHPG', // help
          'CDN843R1N', // javascript
          'CDN83VAQG', // plugins
        ],
      });

      return { success: true };
    } catch (e) {
      if (isErrorResponse(e)) {
        console.log(errorLabels[e.data.error] || `Slack error: ${e.data.error}`);
        throw new ActionError({
          code: 'UNPROCESSABLE_CONTENT',
          message: errorLabels[e.data.error] || `Slack error: ${e.data.error}`,
        });
      }

      logToRollbar(e, { context: { action: 'inviteEmailToSlackChannel', input } });

      throw e;
    }
  },
});
