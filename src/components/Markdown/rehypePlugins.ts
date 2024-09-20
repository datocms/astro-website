import type { Root } from 'hast';
import { matches, select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import { slugify } from '~/lib/slugify';

export function figureAroundCodeBlocks() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node, index, parent) => {
      if (
        parent &&
        index !== undefined &&
        matches('pre', node) &&
        select(':scope > code:only-child', node)
      ) {
        parent.children[index] = {
          type: 'element',
          tagName: 'prose-island',
          properties: {},
          children: [node],
        };
      }
    });
  };
}

export function autolinkHeadings() {
  return function transformer(tree: Root) {
    const headings = selectAll('h1, h2, h3, h4, h5, h6', tree);
    for (const heading of headings) {
      const anchor = slugify(toString(heading));
      heading.properties['id'] = '';
      heading.children.push({
        type: 'element',
        tagName: 'a',
        properties: { 'data-anchor': anchor, id: anchor },
        children: [],
      });
      heading.children.push({
        type: 'element',
        tagName: 'a',
        properties: { 'data-permalink': 'true', href: `#${anchor}` },
        children: [],
      });
    }
  };
}
