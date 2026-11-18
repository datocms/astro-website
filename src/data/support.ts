import type { ContactFormData } from '~/data/contact';
import type { HeroData } from '~/data/home';

/*
 * The support page. The support form sends its data to the action
 * forms.submitSupportRequest (Front). The sales form of a topic is the
 * form of /contact (src/data/contact.ts). The names of the fields are the
 * names that the actions expect.
 */

export const seo = {
  title: 'Support',
};

export const hero: HeroData = {
  label: 'Support',
  headline: 'Got issues?',
  subheadline: 'We’re here to help.',
  face: 'calm',
};

export const picker = {
  /** The heading of the grid of topics. */
  heading: 'Pick a topic.',
  guidesTitle: 'Popular guides and tutorials',
  guidesText: 'The fastest answer is often in these guides.',
  moreTitle: 'Didn’t find it?',
  moreLink: 'Contact our support team',
  /**
   * The text that a screen reader reads after the choice of a topic. The
   * text is not visible: the visitor sees the change.
   */
  status: {
    helpAndForm: (topic: string) => `The help for ${topic} and the form are below.`,
    help: (topic: string) => `The help for ${topic} is below.`,
    form: (topic: string) => `The form for ${topic} is below.`,
    subtopics: (topic: string) => `Choose the kind of ${topic} below.`,
  },
};

// The usual reply time of the support team. The page after the form
// (/support/thanks) shows it. The text above the support form is in the
// CMS (the Support department) and gives the same time.
export const replyTime = 'Expect a reply in less than 10 hours.';

// One sentence below the heading of the topics, with three links. They
// answer the usual questions without a request. The parts are text and
// links, in the order of the sentence.
export const shortcuts: ({ text: string } | { label: string; href: string })[] = [
  { text: 'Or go straight to the ' },
  { label: 'docs', href: '/docs' },
  { text: ', the ' },
  { label: 'Community forum', href: 'https://community.datocms.com' },
  { text: ', or the ' },
  { label: 'status page', href: 'https://status.datocms.com' },
  { text: '.' },
];

const legal = {
  before: 'By submitting you agree to our ',
  terms: { label: 'Terms', href: '/legal/terms' },
  between: ' and ',
  privacy: { label: 'Privacy policy', href: '/legal/privacy-policy' },
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
        label: 'What’s your question?',
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
    'Something went wrong and your request wasn’t sent. Please try again, or email us at support@datocms.com',
  noscriptMessage:
    'This form needs JavaScript. Turn on JavaScript and reload the page, or email us at support@datocms.com.',
  // The action gives a redirect: the form never shows this.
  success: {
    headline: 'Thanks, we’ve got it.',
    muted: 'Our support team will be in touch shortly',
    face: 'approved',
    button: { label: 'Back to homepage', href: '/', variant: 'soft' },
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
