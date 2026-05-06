import type { ElementContent, Root } from 'hast';
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
const calloutMarkerRegex = /^\[!\w+\][ \t]*/;

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

      const [, calloutType] = match;
      const lowerCaseType = calloutType!.toLowerCase();

      // Split the first paragraph's inline children into the title (everything
      // up to the first newline, after the `[!TYPE] ` marker) and the rest of
      // the content. This preserves inline formatting (e.g. `<code>`) inside
      // the title and prevents the title text from leaking into the content.
      const titleChildren: ElementContent[] = [];
      const remainingFirstPChildren: ElementContent[] = [];
      let titleConsumed = false;
      let regexStripped = false;

      for (const child of firstChild.children) {
        if (titleConsumed) {
          remainingFirstPChildren.push(child);
          continue;
        }

        if (child.type === 'text') {
          let value = child.value;
          if (!regexStripped) {
            value = value.replace(calloutMarkerRegex, '');
            regexStripped = true;
          }
          const newlineIdx = value.indexOf('\n');
          if (newlineIdx !== -1) {
            const titlePart = value.slice(0, newlineIdx);
            const contentPart = value.slice(newlineIdx + 1);
            if (titlePart) titleChildren.push({ type: 'text', value: titlePart });
            if (contentPart) remainingFirstPChildren.push({ type: 'text', value: contentPart });
            titleConsumed = true;
          } else if (value) {
            titleChildren.push({ type: 'text', value });
          }
        } else {
          titleChildren.push(child);
        }
      }

      // Trim leading whitespace from the first remaining title node.
      while (titleChildren[0]?.type === 'text') {
        titleChildren[0].value = titleChildren[0].value.trimStart();
        if (titleChildren[0].value) break;
        titleChildren.shift();
      }

      // Replace the first paragraph's children with the leftover content; if
      // empty, drop the paragraph altogether.
      firstChild.children = remainingFirstPChildren;
      const contentChildren =
        remainingFirstPChildren.length > 0
          ? node.children
          : node.children.filter((child) => child !== firstChild);

      const newNode = h('figure', [
        h(
          'div',
          {
            'data-callout-type': lowerCaseType,
          },
          [
            ...(titleChildren.length > 0
              ? [h('div', { 'data-callout-title': true }, titleChildren)]
              : []),
            h('div', { 'data-callout-content': true }, ...contentChildren),
          ],
        ),
      ]);

      // Replace the original <blockquote> with our new <figure>
      parent.children[index] = newNode;
    });
  };
}
