import polestarClient from '~/assets/home/clients/polestar.svg?raw';
import vercelClient from '~/assets/home/clients/vercel.svg?raw';
import verizonClient from '~/assets/home/clients/verizon.svg?raw';
import harrysClient from '~/assets/support/harrys.svg?raw';
import hashicorpClient from '~/assets/support/hashicorp.svg?raw';
import type { LogoItem } from '~/components/LogosLine';
import type { ContactFormData } from '~/data/contact';
import { svgLogo } from '~/data/home';

/*
 * The support page. The support form sends its data to the action
 * forms.submitSupportRequest (Front). The sales form of a topic is the
 * form of /contact (src/data/contact.ts). The names of the fields are the
 * names that the actions expect.
 */

export const seo = {
  title: 'Support page',
};

export const hero = {
  label: 'Support page',
  headline: 'Got issues?',
  subheadline: "We're here to help!",
};

export const picker = {
  topicLabel: 'Topic:',
  placeholder: 'Please select a topic...',
  guidesTitle: 'Popular guides and tutorials',
  guidesText:
    'Please take a look at these resources, as they might probably be the fastest way to solve your issue!',
  moreTitle: "Didn't find what you're looking for?",
  moreLink: 'Contact our support team',
};

export const talk = {
  title: 'Talk with us!',
  text: 'Our experts are available to answer any of your questions. We’re available in a number of ways, any time that you need us.',
};

export const logos = {
  label: 'We power experiences for over half a billion users',
  items: [
    svgLogo(polestarClient, 'Polestar'),
    svgLogo(hashicorpClient, 'HashiCorp'),
    svgLogo(verizonClient, 'Verizon'),
    svgLogo(harrysClient, "Harry's"),
    svgLogo(vercelClient, 'Vercel'),
  ] as LogoItem[],
};

const legal = {
  before: 'By submitting you agree to our ',
  terms: { label: 'Terms', href: '/legal/terms' },
  between: ' and ',
  privacy: { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  after: '.',
};

export const supportForm: ContactFormData = {
  rows: [
    [
      {
        type: 'email',
        name: 'email',
        label: 'DatoCMS account email',
        placeholder: 'Your account email',
        autocomplete: 'email',
        // A simple pattern for an e-mail address.
        pattern: '[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,20}',
        invalidMessage: 'Enter a valid email',
      },
    ],
    [
      {
        type: 'text',
        name: 'project',
        label: 'DatoCMS project URL',
        placeholder: 'https://<YOUR_PROJECT>.admin.datocms.com',
      },
    ],
    [
      {
        type: 'text',
        name: 'subject',
        label: 'Subject',
        placeholder: 'Short description of the issue',
        required: false,
      },
    ],
    [
      {
        type: 'textarea',
        name: 'body',
        label: "What's your question?",
        placeholder: 'Please tell us how we can help',
        requiredMessage: 'Tell us how we can help',
      },
    ],
    [
      {
        type: 'file',
        name: 'uploads',
        label: 'Add any additional attachments, if necessary',
        placeholder: '',
        required: false,
        multiple: true,
      },
    ],
  ],
  legal,
  submitLabel: 'Get in touch',
  sendingMessage: 'Sending your request…',
  submitErrorMessage:
    "Something went wrong and your request wasn't sent. Please try again, or email us at support@datocms.com",
  noscriptMessage:
    'This form needs JavaScript. Turn on JavaScript and reload the page, or email us at support@datocms.com.',
  // The action gives a redirect: the form never shows this.
  success: {
    headline: "Thanks, we've got it.",
    muted: 'Our support team will be in touch shortly',
    face: '[•ᴗ•]',
    button: { label: 'Back to homepage', href: '/', appearance: 'deep-on-white', variant: 'soft' },
  },
};

/** The field of the error ID. It shows only when the URL has `errorId`. */
export const errorIdField = {
  type: 'text',
  name: 'errorId',
  label: 'Error ID',
  placeholder: '',
  required: false,
  readonly: true,
} as const;
