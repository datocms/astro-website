// The static copy of the pricing page. The rows of the comparison and the
// questions of the FAQ come from the dashboard API and from the CMS.

import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData, CtaBannerData, HeroData } from '~/data/home';
import { hero as homeHero } from '~/data/home';

/** The plan change in the dashboard: it buys the Professional plan. */
const purchaseHref = dashboardUrl(
  '/personal-account/plan-billing/change?plan_id=899&utm_source=datocms&utm_medium=website&utm_campaign=pricing',
);

export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  button: ButtonData;
  features: string[];
}

export interface PricingPlansData {
  plans: [PricingPlan, PricingPlan];
}

/**
 * `true` shows a check, `false` shows a dash, a string shows the text.
 * In the text, `\n` starts a new line in the muted colour.
 */
export type PlanValue = boolean | string;

export interface ComparisonRow {
  feature: string;
  info?: string;
  /** More words that the search finds (for example a description or tags). */
  keywords?: string;
  pro: PlanValue;
  enterprise: PlanValue;
}

export interface ComparisonCategory {
  title: string;
  /** The design shows the first four categories open. */
  open?: boolean;
  rows: ComparisonRow[];
}

export interface PlanColumn {
  name: string;
  price: string;
  button: ButtonData;
}

export interface PlanComparisonData {
  headline: string;
  /**
   * The label of a switch next to the search. When it is on, the table
   * hides the rows that have the same value on the two plans.
   * Without a label, there is no switch.
   */
  differencesLabel?: string;
  columns: [PlanColumn, PlanColumn];
}

export interface FaqItem {
  question: string;
  /** The answer as plain text. */
  answer: string;
}

export interface FaqData {
  headline: string;
  items: FaqItem[];
}

export const hero: HeroData = {
  label: 'Pricing',
  headline: 'Honest pricing for ambitious products.',
  subheadline: 'Count on us for flexible pricing that meets you halfway',
};

export const plans: PricingPlansData = {
  plans: [
    {
      name: 'Professional',
      tagline: 'Everything you need – and more – to build great digital projects.',
      price: 'From €149/month billed yearly or €199/monthly',
      button: { label: 'Purchase', href: purchaseHref, appearance: 'deep-on-white' },
      features: [
        'Generous quota with soft limits',
        '10 collaborators / project',
        'Additional projects for €39/month',
        'Expanded authoring roles',
      ],
    },
    {
      name: 'Enterprise',
      tagline: 'Premium features, high-touch support and advanced compliance.',
      price: 'Custom Pricing',
      button: { label: 'Contact', href: '/contact', appearance: 'deep-on-light' },
      features: [
        'Guaranteed support and uptime SLAs',
        'SSO, Audit logs and Static webhook IPs',
        'Fully customizable roles and tasks',
        'Support via shared Slack channel',
        'Editorial onboarding',
        'Access to our solution architects',
      ],
    },
  ],
};

export const freeBanner: CtaBannerData = {
  variant: 'subtle',
  headline: 'Just getting started?',
  muted: 'Try DatoCMS out for free, forever (yes really).',
  buttons: [
    {
      label: 'Sign up for free',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    // The page opens the dialog of the free limits for each link to this hash.
    {
      label: 'See the free limits',
      href: '#free-plan-details',
      appearance: 'deep-on-light',
      variant: 'soft',
      arrow: false,
    },
  ],
};

/** The dialog that compares the limits of the Free plan and of the Professional plan. */
export interface FreeLimitsData {
  /** The id of the dialog. A link to `#<id>` opens it, also on page load. */
  id: string;
  headline: string;
  warning: string;
  warningDetail: string;
  columns: [string, string, string];
  closeLabel: string;
}

export const freeLimits: FreeLimitsData = {
  id: 'free-plan-details',
  headline: 'Free vs Professional',
  warning: "In the Free plan, you can't go over the allowed monthly limits.",
  warningDetail: 'If you reach these limits, the service will stop responding as expected.',
  columns: ['Plan limits & overages', 'Free plan', 'Professional plan'],
  closeLabel: 'Close',
};

/** The line under the comparison table. The link opens the dialog of the free limits. */
export const freeReminder = {
  lead: 'We also offer a',
  strong: '100% free plan',
  text: '. No overages allowed.',
  link: { label: 'See all limits in detail', href: '#free-plan-details' },
};

export const partnerBanner: CtaBannerData = {
  variant: 'subtle',
  headline: 'Working on many client projects?',
  muted: 'Our Agency Partner Program starts at €39/month.',
  buttons: [
    {
      label: 'Discover the program',
      href: '/partner-program',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};

export const comparison: PlanComparisonData = {
  headline: 'Compare plans',
  differencesLabel: 'Only show differences',
  columns: [
    {
      name: 'Professional',
      price: 'From €149/month',
      button: {
        label: 'Purchase',
        href: purchaseHref,
        appearance: 'deep-on-white',
        variant: 'soft',
      },
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      button: { label: 'Contact', href: '/contact', appearance: 'deep-on-white', variant: 'soft' },
    },
  ],
};

export const aiBanner: CtaBannerData = {
  variant: 'plain',
  headline: 'AI at no extra cost [•ᴥ•]',
  muted: 'Bring your own tools and pay your provider directly.',
};

export const trustedBy: HeroData = {
  label: 'Trusted By Teams',
  headline:
    "We've worked with our customers long enough that they tell our story better than we do.",
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
  ],
  logos: homeHero.logos,
};

/** The questions of the FAQ come from the CMS. */
export const faq: Omit<FaqData, 'items'> = {
  headline: 'FAQ',
};

export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'Start building.',
  muted: 'Explore DatoCMS and never look back.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};
