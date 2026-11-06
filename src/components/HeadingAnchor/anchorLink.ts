import { stripStega } from '@datocms/astro';

/**
 * The attributes of the link in a <heading-anchor>. The component and
 * autolinkHeadings use this function, thus the markup is the same.
 * `text` is the text of the heading, for the accessible name.
 */
export function anchorLink(id: string, text: string) {
  return {
    href: `#${id}`,
    title: 'Copy link',
    'aria-label': `Copy link to ${stripStega(text).trim()}`,
  };
}
