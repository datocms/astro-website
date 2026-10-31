import { getData } from 'country-list';
import { contact, type ContactFormData, type FormOption } from '~/data/contact';

/*
 * The agency partner program page. The form sends its data to the action
 * forms.submitPartnerProgramRequest (Pipedrive and Front). The names of the
 * fields are the names that the action expects. The logos and the
 * testimonials come from the CMS.
 */

export const seo = {
  title: 'Special pricing for agencies',
};

export const hero = {
  label: 'DatoCMS Agency Partner Program',
  headline: 'Become a Partner',
  subheadline:
    'Agency-specific plans from €39/month. No sales targets. No reselling requirements. No BS. Just real benefits including 30% off for your clients and free access to every project you manage.',
  button: { label: 'Become a Partner', href: '#partner-form' },
};

export const logos = {
  label: '250+ happy Partners in 50+ Countries',
};

export interface Benefit {
  title: string;
  /** HTML: the text has links. */
  body: string;
  /** A second link under the text. */
  link?: { label: string; href: string };
}

export const benefits = {
  headline: 'Partnerships done right',
  muted:
    "DatoCMS was born out of an agency. It's only natural that our partner program incorporates all the essential elements to support the success of your agency.",
  items: [
    {
      title: '💰 Special plans and deals',
      body: 'Custom plans to get you started without surprises, and a 30% discount on the Professional plan for your clients.',
    },
    {
      title: '🎁 Discounts for your clients',
      body: 'Enable special plans on your clients\' accounts <a href="/docs/agency-partner-program/partners-dashboard#enabling-special-plans-to-clients">directly from your dashboard</a>, no need to ask us.',
    },
    {
      title: "🔑 Full access to your clients' projects",
      body: 'Give your team <a href="/docs/agency-partner-program/partners-dashboard#automatic-access-to-your-clients-projects">predefined access to all client projects</a> without any extra collaborator seats.',
    },
    {
      title: '🧙‍♂️ Dedicated partner manager',
      body: 'Direct access to our Partner Team for you and your clients, with constant updates and support.',
    },
    {
      title: '🔖 Dedicated partner listing',
      body: 'Get listed on our <a href="/partners">Partners page</a> with your projects and co-marketing content so teams looking for development help can find you.',
      link: { label: 'Explore our partner listings →', href: '/partners' },
    },
    {
      title: '🫶 Co-marketing',
      body: 'We\'ll promote your work through <a href="/case-studies">case studies</a>, articles, and other collaborations. We also LOVE to talk to you about your work.',
      link: { label: 'Explore our partner chats →', href: '/blog/casual-chats' },
    },
  ] satisfies Benefit[],
};

export const plans = {
  variant: 'subtle',
  headline: 'Agency partners unlock plans',
  muted: 'starting at just €39/month',
  subline:
    "Yeah, that's not a typo. We designed our partnership program to help you find new clients, gain more flexibility, and receive assistance in implementing projects with DatoCMS.",
  button: { label: 'Become a Partner', href: '#partner-form' },
} as const;

export const steps = {
  title: 'Getting started is easy',
  muted: 'Join our Partner Program and start your journey to become a DatoCMS Partner today.',
  items: [
    {
      title: 'Submit the form',
      text: "Fill in the form below to share some details, and tell us a bit about who you are and what you're working on.",
    },
    {
      title: 'Complete the enrollment',
      text: 'While you can already enjoy the benefits, activate a paid plan and fill out your public Partner profile for us to get you listed.',
    },
    {
      title: "It's official",
      text: "Utilize the support of our partnership and grow your business. We'll reach out about co-marketing opportunities all the time!",
    },
  ],
};

export const talk = {
  headline: "Let's talk!",
  muted: "Fill in the form, and we'll be in touch!",
};

// All the countries of the package country-list: the ISO code is the value.
const countries: FormOption[] = getData()
  .map(({ code, name }) => ({ value: code, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const form: ContactFormData = {
  rows: [
    [
      {
        type: 'text',
        name: 'firstName',
        label: 'Your first name',
        placeholder: 'Enter your first name',
        autocomplete: 'given-name',
      },
      {
        type: 'text',
        name: 'lastName',
        label: 'Your last name',
        placeholder: 'Enter your last name',
        autocomplete: 'family-name',
      },
    ],
    [
      {
        type: 'text',
        name: 'agencyName',
        label: "What's the name of your agency?",
        placeholder: 'Acme Inc.',
        autocomplete: 'organization',
      },
      {
        type: 'text',
        name: 'agencyUrl',
        label: 'Do you have a website?',
        placeholder: 'https://www.acme.com',
        autocomplete: 'url',
      },
    ],
    [
      {
        type: 'select',
        name: 'teamSize',
        label: 'Company size',
        placeholder: 'Select number of employees',
        options: ["1 — it's just me", '2-10', '10-50', '50-200', '200-1000', '1000+'],
      },
      {
        type: 'select',
        name: 'productFamiliarity',
        label: 'How familiar are you with DatoCMS?',
        placeholder: 'Please select one...',
        options: [
          'Exploring the product',
          'Already published a few projects',
          'Already published +10 projects',
        ],
      },
    ],
    [
      {
        type: 'email',
        name: 'email',
        label: "What's your DatoCMS account email?",
        placeholder: 'info@acme.com',
        autocomplete: 'email',
        // A simple pattern for an e-mail address.
        pattern: '[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,20}',
        invalidMessage: 'Enter a valid email',
      },
      {
        type: 'select',
        name: 'country',
        label: 'Where are you based?',
        placeholder: 'Select your country',
        options: countries,
        requiredMessage: 'Please select a country',
      },
    ],
    [
      {
        type: 'textarea',
        name: 'body',
        label:
          'Please introduce yourself and your agency. If you have any additional question or concern, please ask!',
        placeholder: 'Looking forward to chatting with you!',
      },
    ],
  ],
  legal: contact.form.legal,
  submitLabel: "Let's have a chat!",
  sendingMessage: 'Sending your request…',
  submitErrorMessage:
    "Something went wrong and your request wasn't sent. Please try again in a few minutes.",
  noscriptMessage:
    'This form needs JavaScript. Turn on JavaScript and reload the page, or email us at support@datocms.com.',
  // The page goes to /partner-program/thanks after the submit: the form never shows this.
  success: {
    headline: 'Thank you for reaching out!',
    muted: 'We will be in touch soon',
    face: '[•ᴗ•]',
    button: { label: 'Back to homepage', href: '/', appearance: 'deep-on-white', variant: 'soft' },
  },
};
