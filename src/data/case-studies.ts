import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData, CaseStudiesData, CtaBannerData, HeroData } from '~/data/home';

export interface QuoteData {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export const hero: HeroData = {
  label: 'Case Studies',
  headline: 'Cream of the crop.',
  subheadline: 'See how teams have used DatoCMS to build successful digital experiences',
  face: '[•ᴗ•]',
  buttons: [
    {
      label: 'Let’s Talk!',
      href: '/contact',
      appearance: 'deep-on-light',
      arrow: false,
      leading: 'userpic',
      leadingImages: [{ src: '/images/home/userpic-talk.png' }],
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};

/* The button of the highlight story. The page gives the link. */
export const featuredButton: Omit<ButtonData, 'href'> = {
  label: 'Learn More',
  appearance: 'deep-on-white',
  variant: 'soft',
};

/* The quote when the CMS does not give the testimonial. */
export const quote: QuoteData = {
  quote:
    '“DatoCMS is fast, flexible and a pleasure to use – for both our clients and our developers. It’s become an essential tool for us.”',
  name: 'Tim Chesney',
  role: 'Director at Make',
  avatar: '/images/case-studies/tim-chesney.png',
};

export const ctaBuild: CtaBannerData = {
  variant: 'dark',
  theme: 'orange',
  headline: 'Want to build faster?',
  muted: 'Every feature is built around real customer insights and needs [•ᴗ•]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'light-on-deep',
      arrow: false,
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'light-on-deep', variant: 'soft' },
  ],
};

export interface StatementData {
  label: string;
  text: string;
}

export const moreCaseStudies: CaseStudiesData = {
  headline: 'Cool work, alongside cool people.',
  subheadline: 'Explore more case studies to see how different teams work with DatoCMS at scale.',
};

export const ctaBuildShort: CtaBannerData = { ...ctaBuild, muted: undefined };
