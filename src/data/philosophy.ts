import type { CtaBannerData, HeroData } from '~/data/home';
import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { Theme } from '~/lib/theme';

interface Principle {
  title: string;
  text: string;
  theme: Theme;
  /** Makes the title a link. */
  href?: string;
}

export interface PrinciplesData {
  principles: Principle[];
}

export const hero: HeroData = {
  label: 'Philosophy',
  headline: 'Built on our terms. Used on yours.',
  subheadline: 'We have strong opinions about what makes a CMS brilliant and reliable',
  intro: 'Every day, we try to live up to them.',
  face: 'proud',
};

export const principles: PrinciplesData = {
  principles: [
    {
      title: 'Our opinions come from experience.',
      text: 'With roots in agency, we used CMSes of every shape and size. We saw where they got in people’s way, and built DatoCMS to be the content infrastructure that real work runs on.',
      theme: 'green',
    },
    {
      title: 'A CMS is just that: the “boring” infrastructure.',
      text: 'Content is the foundation of your organization, so we think long-term. We’re with you at the start, and we plan to stay to the very end.',
      theme: 'green',
    },
    {
      title: 'We don’t try to tame AI here.',
      text: 'We let it shine. No pricey integrations that train on your data and inflate your bill. Bring your own AI, and change your mind whenever you like.',
      theme: 'default',
    },
    {
      title: 'We price things the way we’d want to pay for them.',
      text: 'Linear, transparent, predictable. No scary jumps and no guilt-tripping in a field that usually punishes you for growing. Just room to grow without giving up control.',
      theme: 'default',
    },
    {
      title: 'We run purely on our customers’ subscriptions.',
      text: 'DatoCMS is bootstrapped and profitable, with no debt and no investors. The only pressure we feel is to give you a CMS worth building ambitious projects on.',
      theme: 'default',
    },
    {
      title: 'We’re building a company to keep, not to sell.',
      text: 'No exit plan and no acquisition on the horizon. Every decision is made by people who expect to still be here in ten years, looking after what they ship today.',
      theme: 'default',
    },
    {
      title: 'Real people, real conversations.',
      text: 'We’re 13 people, so support comes from those building and using DatoCMS every day. Whether you want to think something through or just need an answer, we care about both.',
      theme: 'blue',
    },
    {
      title: 'European.',
      text: 'We build like we eat: slowly, passionately, with care, and with conviction. Real holidays, sane hours, and the stubborn belief that good things take time. And sunshine.',
      theme: 'blue',
    },
  ],
};

export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'default',
  headline: 'Yes, we’re Italian. We talk with our hands.',
  muted: 'We build with them too. Try DatoCMS for free.',
  buttons: [
    { label: 'Get Started', href: dashboardUrl('/signup'), arrow: false },
    { label: 'Explore Pricing', href: '/pricing', variant: 'soft' },
  ],
};
