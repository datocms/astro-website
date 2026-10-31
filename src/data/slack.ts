import type { ContactFormData } from '~/data/contact';

/*
 * The Slack page. The form sends its data to the action
 * inviteEmailToSlackChannel (src/actions). The name of the field is the
 * name that the action expects.
 */

export const seo = {
  title: 'Join the DatoCMS Slack Channel',
};

export const hero = {
  label: 'DatoCMS Community Slack Channel',
  headline: 'Join us on Slack!',
  subheadline:
    "Try out new product updates before they're widely released, help us test and improve the product, and connect with other users!",
};

export const form: ContactFormData = {
  rows: [
    [
      {
        type: 'email',
        name: 'email',
        label: 'Please insert your email',
        placeholder: 'm.smith@gmail.com',
        autocomplete: 'email',
        // A simple pattern for an e-mail address.
        pattern: '[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,20}',
        requiredMessage: 'Please enter your email',
        invalidMessage: 'Enter a valid email',
      },
    ],
  ],
  legal: {
    before: 'By submitting you agree to our ',
    terms: { label: 'Terms', href: '/legal/terms' },
    between: ' and ',
    privacy: { label: 'Privacy Policy', href: '/legal/privacy-policy' },
    after: '.',
  },
  submitLabel: 'Get my Slack invite!',
  sendingMessage: 'Sending your invite request…',
  submitErrorMessage:
    "Something went wrong and your invite wasn't sent. Please try again in a few minutes.",
  noscriptMessage: 'This form needs JavaScript. Turn on JavaScript and reload the page.',
  // The page goes to /slack/thanks after the submit: the form never shows this.
  success: {
    headline: 'Welcome on board!',
    muted: 'Check your email for the invite',
    face: '[•ᴗ•]',
    button: { label: 'Back to homepage', href: '/', appearance: 'deep-on-white', variant: 'soft' },
  },
};
