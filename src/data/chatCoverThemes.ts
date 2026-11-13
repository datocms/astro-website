import type { Theme } from '~/lib/theme';

/*
 * The theme of each casual chat, by the slug of the chat. The CMS has no
 * field for it. The theme gives the colours of the cover and of the page.
 *
 * The slugs are in the order of the feed, the newest first. The themes
 * cycle through the list below, so each three neighbours have three different
 * themes. A chat that is not in the list gets a theme from its slug.
 */

const cycle: Theme[] = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink'];

const feedOrder = [
  'on-the-aesthetics-of-a-lighter-internet',
  'on-trading-templates-for-topography',
  'on-mirroring-bold-design-in-structured-content',
  'on-unlocking-unique-use-cases-with-java-and-datocms',
  'on-shipping-rapidly-from-one-project-to-the-nuxt',
  'on-helping-shape-the-graphql-community-as-we-know-it',
  'on-building-visually-stunning-projects-at-scale',
  'on-powering-offline-wayfinding-for-printemps',
  'on-building-astro-themes-for-multi-brand-websites',
  'on-going-beyond-the-cms-with-plugins',
  'on-keeping-things-simple-because-static-ain-t-dead',
  'focusing-on-flexibility-extensibility-with-plugins-and-head-start',
  'renuo-and-the-birth-of-dato-rails-for-ruby-on-rails-projects',
  'rotate',
  'dreipol-sfg-basel',
  'fully-studios',
  'bejamas-and-van-raam',
  'trip-to-japan',
  'safetychain',
];

/** The slugs of the chats, the newest first. */
export const chatSlugs = feedOrder;

/** The theme of the chat with this slug. */
export function chatCoverTheme(slug: string): Theme {
  const index = feedOrder.indexOf(slug);
  if (index >= 0) return cycle[index % cycle.length]!;
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return cycle[hash % cycle.length]!;
}
