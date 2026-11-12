import type { FaceName } from '~/lib/motion/faces';
import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData } from '~/components/Button';
import type { CategoryNavData } from '~/components/CategoryNav';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { Theme } from '~/lib/theme';

export interface FeatureCategoryData {
  /** The anchor of the section. The category nav links to it. */
  id: string;
  /** The label in the category nav. */
  navLabel: string;
  title: string;
  description: string;
  theme: Theme;
}

/** The last card of the list: the slot of the next feature. */
export interface OpenSlotData {
  title: string;
  description: string;
  button: ButtonData;
}

/** What the face at the edge of the page says, at a point of the list. */
interface BuddyLine {
  /** The share of the list scrolled past, from 0 to 1. */
  at: number;
  /** The face plays its reaction (src/lib/motion/faces.ts) when the line shows. */
  face: FaceName;
  text: string;
}

export interface BuddyData {
  lines: BuddyLine[];
}

export const hero: HeroData = {
  label: 'Features',
  headline: 'A list that keeps on growing.',
  subheadline: 'Here is everything DatoCMS does, in one list.',
  face: 'worried',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    {
      label: 'Talk to sales',
      href: '/contact',
      contact: 'sales',
      variant: 'soft',
    },
  ],
};

const categoryData: Omit<FeatureCategoryData, 'id' | 'navLabel'>[] = [
  {
    title: 'Core features',
    description:
      'Separate content, settings, and branding across multiple sites, apps, or clients.',
    theme: 'blue',
  },
  {
    title: 'Editor experience',
    description:
      'A powerful, intuitive editing interface with live collaboration, visual editing, and structured content tools.',
    theme: 'green',
  },
  {
    title: 'Developer experience',
    description:
      'APIs, SDKs, and developer tools designed for seamless integration with any tech stack.',
    theme: 'blue',
  },
  {
    title: 'Image & video management',
    description:
      'Built-in media processing with transformations, optimization, and adaptive streaming.',
    theme: 'green',
  },
  {
    title: 'Localization',
    description:
      'Comprehensive multi-language support with field-level localization and per-locale publishing controls.',
    theme: 'blue',
  },
  {
    title: 'Extensibility',
    description:
      'Extend functionality with plugins, webhooks, integrations, and a flexible plugin SDK.',
    theme: 'green',
  },
  {
    title: 'Content integrity',
    description:
      'Safely test and deploy content changes with sandboxed environments, forks, and instant rollbacks.',
    theme: 'blue',
  },
  {
    title: 'Governance & compliance',
    description:
      'Enterprise-grade access control, audit logging, SSO, and custom domain configuration.',
    theme: 'green',
  },
  {
    title: 'Security & infrastructure',
    description:
      'Secure, reliable infrastructure with encryption, global CDN, and 24/7 monitoring.',
    theme: 'blue',
  },
];

// The nav labels are not the same as the section titles.
const nav: [id: string, label: string][] = [
  ['core', 'Core features'],
  ['editor-experience', 'Editor experience'],
  ['developer-experience', 'Developer experience'],
  ['image-video', 'Image & video'],
  ['localisation', 'Localisation'],
  ['extensibility', 'Extensibility'],
  ['content-integrity', 'Content'],
  ['compliance', 'Compliance'],
  ['security', 'Security'],
];

export const categories: FeatureCategoryData[] = categoryData.map((category, i) => ({
  ...category,
  id: nav[i]![0],
  navLabel: nav[i]![1],
}));

export const categoryNav: CategoryNavData = {
  items: categories.map((category) => ({
    label: category.navLabel,
    href: `#${category.id}`,
  })),
};

export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'blue',
  headline: 'That’s the list. For now.',
  subline: 'The best way to understand any of it is to use it. Free account, no card.',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
  ],
};

// The last card of the last group. The list keeps on growing, and the
// visitor is invited in.
export const openSlot: OpenSlotData = {
  title: 'Next one goes here.',
  description: 'Tell us what’s missing.',
  button: {
    label: 'Suggest a feature',
    href: 'https://community.datocms.com/c/feature-requests/22',
    variant: 'soft',
  },
};

// The face at the edge of the page, and what it says along the list. The
// mood follows the list: a wink to start, a smile, a deadpan halfway, eyes
// that shine near the end, and arms up at the end.
export const buddy: BuddyData = {
  lines: [
    { at: 0, face: 'wink', text: 'Here we go.' },
    { at: 0.25, face: 'happy', text: 'Still going.' },
    { at: 0.5, face: 'serious', text: 'Halfway. Really.' },
    { at: 0.75, face: 'starry', text: 'Nearly there.' },
    { at: 1, face: 'cheer', text: 'Made it!' },
  ],
};
