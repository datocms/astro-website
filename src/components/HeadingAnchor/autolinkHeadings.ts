import type { Root } from 'hast';
import { selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { slugify } from '~/lib/slugify';
import { anchorLink } from './anchorLink';

/** A rehype plugin: gives each heading an id and a <heading-anchor>. */
export function autolinkHeadings() {
  return function transformer(tree: Root) {
    for (const heading of selectAll('h1, h2, h3, h4, h5, h6', tree)) {
      const text = toString(heading);
      const id = slugify(text);

      heading.properties['id'] = id;
      heading.children.push(h('heading-anchor', [h('a', anchorLink(id, text))]));
    }
  };
}
