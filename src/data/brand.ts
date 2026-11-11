import type { CtaBannerData, HeroData } from '~/data/home';

/*
 * The brand page: the name, the logo files and the rules for the people
 * who use them. The rules are the public part of BRAND.md (repository
 * root). The files are in public/brand/: `npm run brand-assets` makes them
 * from the master files of src/assets/logo/.
 */

export const seo = {
  title: 'Brand assets',
  description:
    'The DatoCMS name and logo: the files to download, and the rules for partners, press, and plugin authors.',
};

export const hero = {
  label: 'Brand',
  headline: 'Our name and our logo.',
  subheadline: 'Yours to use, with a few rules.',
  intro:
    'Writing about DatoCMS, building on it, or putting us on a slide? Here are the files, and what to do with them.',
  buttons: [
    {
      label: 'Download the logo pack (.zip)',
      href: '/brand/datocms-brand-assets.zip',
      arrow: false,
    },
  ],
  /** The drawing of the symbol with the lines of its construction. */
  drawing: {
    alt: 'The DatoCMS symbol, a capital D, with the lines of its construction: a square, a circle that touches its four sides, and a round hole in the center',
    caption: 'A square, a circle, and a round hole.',
  },
} satisfies HeroData & { drawing: { alt: string; caption: string } };

/** A way to write something, and the ways that are wrong. */
export interface WordingRule {
  write: string;
  not: string[];
  note: string;
}

export const name = {
  headline: 'DatoCMS.',
  muted: 'One word, two capitals.',
  /** The names of the three columns of the list. */
  heads: ['Write', 'Not', 'Because'],
  rules: [
    {
      write: 'DatoCMS',
      not: ['Dato CMS', 'Datocms', 'Dato'],
      note: 'The name of the product and of the company. Dato srl is only the legal entity.',
    },
    {
      write: 'built with DatoCMS',
      not: ['powered by Dato'],
      note: 'Say how your work relates to ours: built with, a plugin for, works with.',
    },
    {
      write: 'Acme Translator for DatoCMS',
      not: ['DatoCMS Translator'],
      note: 'Your product, company, or domain doesn’t start with our name.',
    },
  ] satisfies WordingRule[],
};

/**
 * A file of public/brand/, without its extension: the page links the SVG
 * and the PNG.
 *   light, dark  the logo is transparent, the page shows it on this ground.
 *   circle       the picture has its own ground, the page cuts it in a circle.
 *   rounded      the same, in a square with round corners.
 */
export interface BrandAsset {
  file: string;
  title: string;
  note: string;
  preview: 'light' | 'dark' | 'circle' | 'rounded';
  /** A description of the picture, for a visitor who cannot see it. */
  alt: string;
}

export const logo = {
  headline: 'The logo.',
  muted: 'One color, always.',
  intro:
    'The wordmark is the one to use. The symbol is for the places where the wordmark doesn’t fit, or where our name is already next to it.',
  /** The button that copies the source of the SVG. Its full name is "Copy SVG". */
  copy: 'Copy',
  copied: 'Copied',
  assets: [
    {
      file: 'datocms-wordmark-dark',
      title: 'Wordmark, dark',
      note: 'For a light ground.',
      preview: 'light',
      alt: 'The DatoCMS wordmark in a dark color',
    },
    {
      file: 'datocms-wordmark-white',
      title: 'Wordmark, white',
      note: 'For a dark ground.',
      preview: 'dark',
      alt: 'The DatoCMS wordmark in white',
    },
    {
      file: 'datocms-symbol-dark',
      title: 'Symbol, dark',
      note: 'For a light ground.',
      preview: 'light',
      alt: 'The DatoCMS symbol, a capital D, in a dark color',
    },
    {
      file: 'datocms-symbol-white',
      title: 'Symbol, white',
      note: 'For a dark ground.',
      preview: 'dark',
      alt: 'The DatoCMS symbol in white',
    },
    {
      file: 'datocms-symbol-purple',
      title: 'Symbol, purple',
      note: 'Our color when the symbol stands alone, on a dark ground.',
      preview: 'dark',
      alt: 'The DatoCMS symbol in purple',
    },
    {
      file: 'datocms-avatar',
      title: 'Avatar',
      note: 'For a profile picture that a circle cuts.',
      preview: 'circle',
      alt: 'The dark DatoCMS symbol in a purple circle',
    },
    {
      file: 'datocms-app-icon',
      title: 'App icon',
      note: 'For a square with round corners.',
      preview: 'rounded',
      alt: 'The dark DatoCMS symbol in a purple square with round corners',
    },
  ] satisfies BrandAsset[],
};

export const circle = {
  headline: 'A D is not round.',
  muted: 'In a circle, it needs some help.',
  text: 'The symbol has two sharp corners on the left and a round side on the right. Put it in the middle of a circle and it looks pushed to the left, with its corners at the edge. The avatar file gives it room and moves it to where it looks centered.',
  legend: 'The file in the circle',
  /** The two states of the picture. The page starts with the avatar. */
  options: [
    {
      value: 'symbol',
      label: 'Symbol file',
      verdict: 'Its corners reach the edge, and it looks off-center.',
    },
    {
      value: 'avatar',
      label: 'Avatar file',
      verdict: 'Room on every side, and it looks centered.',
    },
  ],
  sizes: 'The same picture at 64, 40, and 24 px.',
};

/** A rule with a drawing. `id` is the name of the drawing in the page. */
export interface DrawnRule<Id extends string> {
  id: Id;
  text: string;
}

export const rules = {
  headline: 'Leave it as it is.',
  muted: 'We like it this way.',
  give: {
    title: 'Give it',
    items: [
      { id: 'ground', text: 'A flat ground with enough contrast.' },
      { id: 'room', text: 'A margin as tall as the symbol, on every side.' },
      {
        id: 'size',
        text: 'At least 20 px of height for the wordmark, and 16 px for the symbol.',
      },
    ] satisfies DrawnRule<'ground' | 'room' | 'size'>[],
  },
  dont: {
    title: 'Don’t',
    items: [
      { id: 'tones', text: 'Draw it in two colors, or fade a part of it.' },
      { id: 'outline', text: 'Add a gradient, a shadow, or an outline.' },
      { id: 'orange', text: 'Use the old orange logo. It’s retired.' },
      { id: 'stretch', text: 'Stretch it, rotate it, or redraw it.' },
      { id: 'busy', text: 'Put it on a photo or a busy picture.' },
      { id: 'own', text: 'Make it part of your own logo or icon.' },
    ] satisfies DrawnRule<'tones' | 'outline' | 'orange' | 'stretch' | 'busy' | 'own'>[],
  },
};

export const together = {
  headline: 'Your work and ours.',
  muted: 'Clear about who made what.',
  items: [
    {
      title: 'Side by side',
      text: 'Put the two logos on one line, at the same visual weight, with a thin line or a × between them. Each logo keeps its own colors and its own room.',
    },
    {
      title: 'Yours comes first',
      text: 'Don’t make our logo larger or louder than your own. Don’t use it as the icon of your plugin, app, or account.',
    },
    {
      title: '“Official” is ours',
      text: 'Only the plugins and starters that we publish are official. Don’t suggest that we made, sponsor, or endorse your work, unless we agreed to it.',
    },
  ],
};

export const closing: CtaBannerData = {
  variant: 'light',
  headline: 'Not sure it’s fine?',
  muted: 'Ask us.',
  buttons: [{ label: 'Contact us', href: '/contact' }],
};
