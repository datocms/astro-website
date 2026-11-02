import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData } from '~/components/Button';
import type { StatementData } from '~/components/Statement';
import type { CaseStudiesData, CtaBannerData, HeroData } from '~/data/home';

export const hero: HeroData = {
  label: 'Case Studies',
  headline: 'Cream of the crop.',
  subheadline: 'See how teams have used DatoCMS to build successful digital experiences',
  face: 'happy',
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

export const ctaBuild: CtaBannerData = {
  variant: 'dark',
  theme: 'orange',
  headline: 'Want to build faster?',
  muted: 'Every feature is built around real customer insights and needs',
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

export const moreCaseStudies: CaseStudiesData = {
  headline: 'Cool work, alongside cool people.',
  subheadline: 'Explore more case studies to see how different teams work with DatoCMS at scale.',
};

export const ctaBuildShort: CtaBannerData = { ...ctaBuild, muted: undefined };
