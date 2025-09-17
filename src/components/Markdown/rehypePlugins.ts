import type { Root } from 'hast';
import { matches, select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
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
          tagName: 'figure',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'prose-island',
              properties: {},
              children: [node],
            },
          ],
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

const calloutRegex = /^\[!(\w+)\](?:\s+(.*))?/;

export function callouts() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node, index, parent) => {
      // We are looking for a <blockquote> element
      if (node.tagName !== 'blockquote' || !parent || index === undefined) {
        return;
      }

      // The first child should be a <p> tag
      const firstChild = node.children.find(
        (child) => child.type === 'element' && child.tagName === 'p',
      );
      if (!firstChild || firstChild.type !== 'element') {
        return;
      }

      // Get the text content of that first <p> tag
      const textContent = toString(firstChild);
      const match = textContent.match(calloutRegex);

      if (!match) {
        return;
      }

      const [, calloutType, title] = match;
      const lowerCaseType = calloutType!.toLowerCase();

      // We need to remove the "[!TYPE] Title" line from the content.
      // We find the specific text node and modify it.
      const textNode = firstChild.children.find((child) => child.type === 'text');
      if (textNode && textNode.type === 'text') {
        textNode.value = textNode.value.replace(calloutRegex, '').trimStart();
      }

      // Create the new HAST node that mimics your Astro component's output
      const newNode = h('figure', [
        h(
          'div',
          {
            'data-callout-type': lowerCaseType,
          },
          [
            ...(title ? [h('div', { 'data-callout-title': true }, [title])] : []),
            h('div', { 'data-callout-content': true }, ...node.children), // Pass the original children
          ],
        ),
      ]);

      // Replace the original <blockquote> with our new <figure>
      parent.children[index] = newNode;
    });
  };
}
