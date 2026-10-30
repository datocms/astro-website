import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData, CtaBannerData, HeroData } from '~/data/home';
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

export interface CategoryNavData {
  items: { label: string; href: string }[];
}

/** The last card of the list: the slot of the next feature. */
export interface OpenSlotData {
  title: string;
  description: string;
  button: ButtonData;
}

/** What the face at the edge of the page says, at a point of the list. */
export interface BuddyLine {
  /** The share of the list scrolled past, from 0 to 1. */
  at: number;
  face: string;
  text: string;
}

export interface BuddyData {
  lines: BuddyLine[];
}

export const hero: HeroData = {
  label: 'Features',
  headline: 'A list that keeps on growing.',
  subheadline: 'Everything DatoCMS does, in one list. Most of it exists because someone asked.',
  face: '[•﹏•]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    {
      label: 'Talk To Sales',
      href: '/contact',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  ],
};

const categoryData: Omit<FeatureCategoryData, 'id' | 'navLabel'>[] = [
  {
    title: 'Core Features',
    description:
      'Separate content, settings, and branding across multiple sites, apps, or clients.',
    theme: 'blue',
  },
  {
    title: 'Editor Experience',
    description:
      'A powerful, intuitive editing interface with live collaboration, visual editing, and structured content tools.',
    theme: 'green',
  },
  {
    title: 'Developer Experience',
    description:
      'APIs, SDKs, and developer tools designed for seamless integration with any tech stack.',
    theme: 'blue',
  },
  {
    title: 'Image & Video Management',
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
    title: 'Content Integrity',
    description:
      'Safely test and deploy content changes with sandboxed environments, forks, and instant rollbacks.',
    theme: 'blue',
  },
  {
    title: 'Governance & Compliance',
    description:
      'Enterprise-grade access control, audit logging, SSO, and custom domain configuration.',
    theme: 'green',
  },
  {
    title: 'Security & Infrastructure',
    description:
      'Secure, reliable infrastructure with encryption, global CDN, and 24/7 monitoring.',
    theme: 'blue',
  },
];

// The nav labels are not the same as the section titles.
const nav: [id: string, label: string][] = [
  ['core', 'Core Features'],
  ['editor-experience', 'Editor Experience'],
  ['developer-experience', 'Developer Experience'],
  ['image-video', 'Image & Video'],
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
      label: 'Get Started For Free',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
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
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// The face at the edge of the page, and what it says along the list.
// Only glyphs that render well in ABC Oracle at a large size: • ^ ◡ _ -
// and ᴗ (as in the heroes). Not: combining accents, ★, ≧, ≦, ω, ʘ.
export const buddy: BuddyData = {
  lines: [
    { at: 0, face: '[••]', text: 'Here we go.' },
    { at: 0.25, face: '[•ᴗ•]', text: 'Still going.' },
    { at: 0.5, face: '[•_•]', text: 'Halfway. Really.' },
    { at: 0.75, face: '[^ᴗ^]', text: 'Nearly there.' },
    { at: 1, face: '[•◡•]', text: 'Made it!' },
  ],
};
