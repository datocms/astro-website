import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { CaseStudiesData, CtaBannerData, FeaturesData, HeroData } from '~/data/home';
import { quote } from '~/data/case-studies';
import type { ButtonData } from '~/data/home';

export interface AudienceHalf {
  label: string;
  text: string;
  button: ButtonData;
}

export interface AudienceSplitData {
  /** The left half, on surface/inverse. */
  inverse: AudienceHalf;
  /** The right half, on surface/accent. */
  accent: AudienceHalf;
}

export interface DocsPreviewItem {
  title: string;
  /** Without a tag, the row keeps the height of the tag. */
  tag?: string;
  description?: string;
  code?: string;
  button?: ButtonData;
}

export interface DocsPreviewData {
  items: DocsPreviewItem[];
}

export interface MarketplaceLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The rendered width, when it is not the full logo box. */
  displayWidth?: number;
}

export interface GuideCardData {
  image: { src: string; alt: string; width: number; height: number };
  category: string;
  title: string;
  href: string;
}

/** A two-tone headline with a button, next to a visual. */
export interface SplitIntro {
  title: string;
  tagline: string;
  button: ButtonData;
}

const learnMore = (href: string): ButtonData => ({
  label: 'Learn More',
  href,
  appearance: 'deep-on-white',
  variant: 'soft',
});

export const hero: HeroData = {
  label: 'For Developers',
  headline: 'From developers who’ve seen enough.',
  subheadline: 'DatoCMS is our answer to the tiny edge cases that become big headaches',
  face: '[^_^]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    {
      label: 'Explore Pricing',
      href: '/pricing',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  ],
};

// Only the first row has a description.
export const pillars: FeaturesData = {
  features: [
    {
      title: 'Your stack. Your call.',
      description:
        'Took ages choosing the perfect stack? Keep it. DatoCMS fits in seamlessly, and will continue to even if you platform to next Tuesday’s cool new framework drop.',
      theme: 'default',
    },
    {
      title: 'Built around developer workflows.',
      description:
        'Environments, migrations and a CLI that fit the way your team already ships code.',
      theme: 'default',
    },
    {
      title: 'Leave content to content teams.',
      description:
        'Editors get a clean, structured interface. You get fewer tickets about the homepage hero.',
      theme: 'default',
    },
    {
      title: 'Ready before you need it.',
      description: 'A global CDN, real-time updates and an image API come with every project.',
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

export const graphqlStatement: CtaBannerData = {
  variant: 'plain',
  headline: 'Headless CMS and GraphQL are a match made in developer heaven.',
  muted: 'We make the most of both.',
};

export { quote };

export const caseStudies: CaseStudiesData = {
  headline: 'Case Studies',
  subheadline: 'Explore more case studies to see how different teams work with DatoCMS at scale.',
};

export const audiences: AudienceSplitData = {
  inverse: {
    label: 'For Marketers',
    text: 'Why let developers have all the fun? DatoCMS is equally loved by digital marketing teams and for good reason.',
    button: {
      label: 'Learn More',
      href: '/editor-experience',
      appearance: 'light-on-deep',
      variant: 'soft',
    },
  },
  accent: {
    label: 'For Content Creators',
    text: 'Structure and manage all your content operations across multiple sites without ever writing an IT ticket.',
    button: {
      label: 'Learn More',
      href: '/editor-experience',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  },
};

export const docs: SplitIntro = {
  title: 'Docs',
  tagline: 'When in doubt, start here.',
  button: learnMore('/docs'),
};

// The design uses the Polestar copy for the Content Delivery API description.
export const docsPreview: DocsPreviewData = {
  items: [
    { title: 'Asset API', tag: 'CDN' },
    {
      title: 'Content Delivery API',
      tag: 'GraphQL',
      description:
        'Polestar’s new website with DatoCMS is a powerhouse of custom plugins and workflows to support 28+ locales.',
      code: '@datocms/cda-client',
    },
    { title: 'Content Management API', tag: 'Rest' },
    { title: 'Real-time updates API', tag: 'SSE' },
  ],
};

export const guides: SplitIntro = {
  title: 'Guides',
  tagline: 'Skip the trial and error.',
  button: learnMore('/user-guides'),
};

export const guideCard: GuideCardData = {
  image: {
    src: '/images/developers/guide-blocks.png',
    alt: 'The DatoCMS editor with a Blog record open',
    width: 880,
    height: 460,
  },
  category: 'Creating & Managing Content',
  title: 'Enriching content with blocks',
  href: '/user-guides',
};

export const marketplace: SplitIntro = {
  title: 'Marketplace',
  tagline: 'Explore and discover the ecosystem.',
  button: learnMore('/marketplace'),
};

const logo = (
  name: string,
  alt: string,
  width: number,
  height: number,
  displayWidth?: number,
): MarketplaceLogo => ({
  src: `/images/developers/logo-${name}.png`,
  alt,
  width,
  height,
  displayWidth,
});

export const marketplaceLogos: MarketplaceLogo[] = [
  logo('netlify', 'Netlify', 297, 118),
  logo('vercel', 'Vercel', 400, 79),
  logo('gitlab', 'GitLab', 400, 176),
  logo('aws', 'AWS', 400, 239),
  logo('cloudflare', 'Cloudflare', 400, 135),
  logo('onelogin', 'OneLogin', 286, 71),
  // The design shows the Okta logo smaller than its box.
  logo('okta', 'Okta', 400, 135, 99),
  logo('google-cloud', 'Google Cloud', 362, 56),
];

export const ctaBuild: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'The best way to get to know DatoCMS',
  muted: 'is to build something with it.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    {
      label: 'Talk To Sales',
      href: '/contact',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};
