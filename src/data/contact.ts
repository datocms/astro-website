import { getData } from 'country-list';
import type { ButtonData } from '~/data/home';

/*
 * Contact sales page. The form sends its data to the action
 * forms.submitSalesRequest (src/actions/forms). The names of the fields and
 * the values of the options go to Pipedrive and Front: do not change them
 * without the sales team.
 */

/** An option with a value that is not its label (Country: the ISO code). */
export interface FormOption {
  value: string;
  label: string;
}

export interface FormFieldData {
  type: 'text' | 'email' | 'select' | 'textarea';
  name: string;
  label: string;
  placeholder: string;
  /** Default: true. */
  required?: boolean;
  autocomplete?: string;
  /**
   * Only for `select`. The value of a string option is its label. Not in
   * the prototype: the FormOption options.
   */
  options?: (string | FormOption)[];
  /**
   * Only for `text` and `email`: the HTML pattern of the value. Default for
   * `email`: a simple e-mail pattern. Not in the prototype.
   */
  pattern?: string;
  /**
   * Shown when the field is empty. Default: "This field is required".
   * The component adds the [x_x] face.
   */
  requiredMessage?: string;
  /** Shown when the value has the wrong format (e-mail only). */
  invalidMessage?: string;
}

export interface ContactLink {
  /** The muted text before the link. */
  lead: string;
  label: string;
  href: string;
}

export interface ContactFormData {
  /** One row is one or two fields. Below 768 each field has its own row. */
  rows: FormFieldData[][];
  legal: {
    before: string;
    terms: { label: string; href: string };
    between: string;
    privacy: { label: string; href: string };
    after: string;
  };
  submitLabel: string;
  /** Read by screen readers while the request is in flight. */
  sendingMessage: string;
  submitErrorMessage: string;
  /**
   * Shown instead of the form when the browser runs no scripts and the
   * page sends the data (ContactForm `external`). Not in the prototype.
   */
  noscriptMessage?: string;
  success: {
    headline: string;
    muted: string;
    face: string;
    /** A line of text under the headline. Not in the prototype. */
    body?: string;
    button: ButtonData;
  };
}

export interface ContactSectionData {
  label: string;
  headline: string;
  muted: string;
  face: string;
  links: ContactLink[];
  form: ContactFormData;
}

// All the countries of the package country-list: the ISO code is the value.
const countries: FormOption[] = getData()
  .map(({ code, name }) => ({ value: code, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const contact: ContactSectionData = {
  label: 'Contact sales',
  headline: "Let's talk about your project.",
  muted: "Tell us what you're building and we'll get back to you",
  face: '[•ᴗ•]',
  links: [
    { lead: 'Need support?', label: 'Visit Support', href: '/support' },
    { lead: 'Self-service plans?', label: 'See Pricing', href: '/pricing' },
  ],
  form: {
    rows: [
      [
        {
          type: 'text',
          name: 'companyName',
          label: 'Company name',
          placeholder: 'Enter your company name',
          autocomplete: 'organization',
        },
      ],
      [
        {
          type: 'select',
          name: 'country',
          label: 'Country',
          placeholder: 'Select your country',
          options: countries,
          requiredMessage: 'Please select a country',
        },
        {
          type: 'select',
          name: 'industry',
          label: 'Industry',
          placeholder: 'Select your industry',
          options: [
            'Agency / Freelancer',
            'Ecommerce / Retail',
            'FinTech',
            'Media / Publishing',
            'SaaS',
            'Automotive',
            'CleanTech / Utility',
            'Food & Beverage',
            'Education',
            'Non-Profit & Culture',
            'Other',
          ],
        },
      ],
      [
        {
          type: 'text',
          name: 'firstName',
          label: 'First name',
          placeholder: 'Enter your first name',
          autocomplete: 'given-name',
        },
        {
          type: 'text',
          name: 'lastName',
          label: 'Last name',
          placeholder: 'Enter your last name',
          autocomplete: 'family-name',
        },
      ],
      [
        {
          type: 'email',
          name: 'email',
          label: 'Work email',
          placeholder: 'name@company.com',
          autocomplete: 'email',
          // The pattern of the old contact form.
          pattern: '[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,20}',
          invalidMessage: 'Enter a valid work email',
        },
        {
          type: 'select',
          name: 'jobFunction',
          label: 'Job function',
          placeholder: 'Select job function',
          options: [
            'Editorial & Content',
            'Developer/Engineering',
            'Product & Project',
            'Sales & Marketing',
            'Administrative',
            'Other',
          ],
        },
      ],
      [
        {
          type: 'select',
          name: 'useCase',
          label: 'Use case',
          placeholder: 'Please select use case',
          options: [
            'Ecommerce',
            'Moving to headless',
            'Migrating from other headless CMS',
            'Agency',
            'Other',
          ],
        },
      ],
      [
        {
          type: 'textarea',
          name: 'body',
          label: "What's your question?",
          placeholder: 'Tell us about your project',
          requiredMessage: 'Tell us a bit about your project',
        },
      ],
      [
        {
          type: 'select',
          name: 'referral',
          label: 'How did you hear about us?',
          placeholder: 'Please select one source',
          options: [
            'A colleague/recommendation/forum',
            'Software review platform (G2, Capterra...)',
            'Our partners (Netlify, Vercel, Imgix...)',
            'Social Media (Twitter, LinkedIn...)',
            'Search',
            'Other',
          ],
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
    submitLabel: 'Get in touch',
    sendingMessage: 'Sending your message…',
    submitErrorMessage:
      "Something went wrong and your message wasn't sent. Please try again, or email us at sales@datocms.com",
    noscriptMessage:
      'This form needs JavaScript. Turn on JavaScript and reload the page, or email us at sales@datocms.com.',
    success: {
      headline: "Thanks, we've got it.",
      muted: 'Our sales team will reply to your work email soon',
      face: '[•ᴗ•]',
      body: 'You will soon get an automated confirmation by email.',
      button: {
        label: 'Back to homepage',
        href: '/',
        appearance: 'deep-on-white',
        variant: 'soft',
      },
    },
  },
};

// The SEO tags of /contact and /contact/thanks. The pages have no CMS
// record. The title gets the suffix of the site.
export const seo = {
  title: 'Contact sales',
  description:
    "Tell the DatoCMS sales team what you're building: plans, enterprise needs, migrations. We reply to your work email.",
};

export const thanksSeo = {
  title: 'Thanks for contacting sales',
  description: 'We have your request. Our sales team will reply to your work email soon.',
};
