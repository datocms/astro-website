import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData, CtaBannerData, HeroData } from '~/data/home';

export interface VersusHalf {
  /** The background of the half: surface/accent or surface/inverse. */
  surface: 'accent' | 'inverse';
  headline: string;
  muted?: string;
  /**
   * Stacked layout only. The rich text of the CMS: it replaces `muted`.
   */
  text?: { value: unknown } | null;
  /**
   * `inline`: one H1 with a muted run. `stacked`: an H1, then the muted
   * text as an H2 below it.
   */
  layout?: 'inline' | 'stacked';
  button?: ButtonData;
}

export interface VersusSplitData {
  halves: [VersusHalf, VersusHalf];
}

/**
 * The static copy of a compare page. The page adds the name of the
 * competitor to the label and to the subheadline.
 */
export const hero: HeroData = {
  headline: 'We’re rooting for DatoCMS.',
  face: '[•~•]',
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
      leading: 'userpic',
      leadingImages: [{ src: '/images/home/userpic-talk.png' }],
    },
  ],
};

/** The buttons below the two characterizations. */
export const introButtons: { datocms: ButtonData; competitor: ButtonData } = {
  datocms: {
    label: 'Sign Up For Free',
    href: dashboardUrl('/signup'),
    appearance: 'deep-on-light',
  },
  competitor: {
    label: 'Talk About Migration',
    href: '/contact',
    appearance: 'light-on-deep',
    variant: 'soft',
  },
};

export const reasonsTitle = 'Three reasons to consider DatoCMS';

export const ctaSwitch: CtaBannerData = {
  variant: 'light',
  theme: 'blue',
  headline: 'Switch to DatoCMS',
  muted: 'and start building big.',
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
