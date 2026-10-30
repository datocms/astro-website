import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { CtaBannerData, FeaturesData, HeroData } from '~/data/home';
import { frameworkIntegration } from '~/data/home';
import { arduino, quote } from '~/data/case-studies';
import type { MediaTextCenteredData } from '~/components/MediaTextCentered';
import type { StatementsSectionData } from '~/components/StatementsSection';

/* Feature page "Visual editing". */

export const hero: HeroData = {
  label: 'Visual Editing',
  headline: 'The shortest path from page to edit.',
  subheadline: 'Find the right place to make edits within two clicks',
  face: '[**]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    { label: 'Talk To Sales', href: '/contact', appearance: 'deep-on-white', variant: 'soft' },
  ],
};

export const jumpToEdit: MediaTextCenteredData = {
  image: {
    src: '/images/editor-experience/visual-editing.png',
    alt: 'A website with an edit panel of DatoCMS open next to the headline',
    width: 915,
    height: 406,
  },
  headline: 'Jump straight to the edit.',
  subline:
    'Make sure design and copy vibe together and work right where it’s happening. Click any element on your site to jump straight to editing.',
};

export const statements: StatementsSectionData = {
  items: [
    { title: 'Flexible.', text: 'Works with any hosting platform.' },
    { title: 'Easy.', text: 'Automatic field detection.' },
    { title: 'Accessible.', text: 'Included on every plan.' },
    { title: 'Tidy.', text: 'Structured text, blocks & linked records.' },
  ],
};

// Only the first row has a description. The data sets no theme.
export const features: FeaturesData = {
  features: [
    {
      title: 'Edit straight from your website.',
      description:
        'Click what you want to change and we’ll take you straight to the right field in DatoCMS. The hunting part is over.',
      theme: 'default',
    },
    {
      title: 'Preview and edit, side by side.',
      description: 'See the draft page next to the form, and watch each change appear as you type.',
      theme: 'default',
    },
    {
      title: 'Set it up once and go.',
      description:
        'Developers connect the site one time. Editors get click-to-edit on every page after that.',
      theme: 'default',
    },
  ],
  button: {
    label: 'See All Features',
    href: '/features',
    appearance: 'light-on-deep',
    variant: 'soft',
  },
};

// The body is the Arduino (Polestar copy) one here.
export const overview = arduino.body;

export { quote };

export const carefullyThought: MediaTextCenteredData = {
  image: {
    src: '/images/editor-experience/editor.png',
    alt: 'The DatoCMS editor',
    width: 2880,
    height: 850,
  },
  headline: 'Carefully thought out features to let you build',
  muted: 'or manage all your complex content needs.',
};

export const integrations = {
  title: 'Stick with what works.',
  tagline:
    'Enabling visual editing is as easy as choosing your framework. We already did the hard part.',
  button: frameworkIntegration.button,
  code: frameworkIntegration.code,
};

export const ctaDemo: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'Ready to see it in action?',
  muted: 'The quickest way to understand Visual Editing is to actually use it.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    {
      label: 'Try The Demo',
      href: 'https://try.datocms.com',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};
