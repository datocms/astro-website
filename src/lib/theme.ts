export type Theme = 'yellow' | 'orange' | 'green' | 'purple' | 'blue' | 'pink' | 'docs';

export const THEMES: Theme[] = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink', 'docs'];

/** The themes of a hue: all the themes but the theme of the docs. */
const HUES: Theme[] = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink'];

/**
 * A theme from a slug: the same slug always gives the same theme, and
 * different slugs give all the themes. An article with no theme of its own
 * takes this one.
 */
export function themeFromSlug(slug: string): Theme {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return HUES[hash % HUES.length]!;
}
