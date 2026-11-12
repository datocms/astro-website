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
      theme: 'yellow',
    },
    {
      title: 'A CMS should be boring. In a good way.',
      text: 'A CMS is infrastructure, so we think long-term. We’re with you at the start, and we plan to stay to the very end.',
      theme: 'yellow',
    },
    {
      title: 'We don’t try to tame AI here.',
      text: 'We let it shine. Bring your own AI, keep your data where it is, and change your mind whenever you like.',
      theme: 'green',
    },
    {
      title: 'We price things the way we’d want to pay for them.',
      text: 'Linear, transparent, predictable. Your bill grows in step with your project, with no scary jumps along the way. Just room to grow without giving up control.',
      theme: 'green',
    },
    {
      title: 'We run purely on our customers’ subscriptions.',
      text: 'We’re bootstrapped and profitable, with no debt and no investors. The only pressure we feel is to give you a CMS worth building ambitious projects on.',
      theme: 'green',
    },
    {
      title: 'We’re building a company to keep, not to sell.',
      text: 'No exit plan and no acquisition on the horizon. We make every decision expecting to still be here in ten years, looking after what we ship today.',
      theme: 'green',
    },
    {
      title: 'Real people, real conversations.',
      text: 'We’re 13 people, so support comes from the people who build DatoCMS every day. Whether you want to think something through or just need an answer, you’ll get someone who knows the code.',
      theme: 'yellow',
    },
    {
      title: 'European.',
      text: 'We build like we eat: slowly, with care, and with conviction. Real holidays, sane hours, and the stubborn belief that good things take time. And sunshine.',
      theme: 'yellow',
    },
  ],
};

export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'yellow',
  headline: 'Yes, we’re Italian. We talk with our hands.',
  muted: 'We build with them too. Try DatoCMS for free.',
  buttons: [
    { label: 'Get started', href: dashboardUrl('/signup'), arrow: false },
    { label: 'Explore pricing', href: '/pricing', variant: 'soft' },
  ],
};
