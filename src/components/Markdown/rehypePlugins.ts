import type { ElementContent, Root } from 'hast';
import { matches, select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
import { slugify } from '~/lib/slugify';

// Wraps each code block in a <figure> and a <prose-island>. Prose does not
// style the island: the code block keeps the style of Expressive Code.
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

// Gives each heading an anchor and a permalink, so a link can point to it.
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

// Changes a blockquote that starts with a marker such as `[!NOTE]` into a
// callout: a <figure> with the type, the title and the content.
export function callouts() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'blockquote' || !parent || index === undefined) {
        return;
      }

      const firstChild = node.children.find(
        (child) => child.type === 'element' && child.tagName === 'p',
      );
      if (!firstChild || firstChild.type !== 'element') {
        return;
      }

      const match = toString(firstChild).match(calloutRegex);
      if (!match) {
        return;
      }

      const lowerCaseType = match[1]!.toLowerCase();

      // The title is the text up to the first line break, after the marker.
      // The rest of the first paragraph stays in the content. The inline
      // formatting of the title (such as <code>) stays.
      const titleChildren: ElementContent[] = [];
      const remainingFirstPChildren: ElementContent[] = [];
      let titleConsumed = false;
      let markerStripped = false;

      for (const child of firstChild.children) {
        if (titleConsumed) {
          remainingFirstPChildren.push(child);
          continue;
        }

        if (child.type === 'text') {
          let value = child.value;
          if (!markerStripped) {
            value = value.replace(calloutMarkerRegex, '');
            markerStripped = true;
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

      while (titleChildren[0]?.type === 'text') {
        titleChildren[0].value = titleChildren[0].value.trimStart();
        if (titleChildren[0].value) break;
        titleChildren.shift();
      }

      // An empty first paragraph leaves the content.
      firstChild.children = remainingFirstPChildren;
      const contentChildren =
        remainingFirstPChildren.length > 0
          ? node.children
          : node.children.filter((child) => child !== firstChild);

      parent.children[index] = h('figure', [
        h('div', { 'data-callout-type': lowerCaseType }, [
          ...(titleChildren.length > 0
            ? [h('div', { 'data-callout-title': true }, titleChildren)]
            : []),
          h('div', { 'data-callout-content': true }, ...contentChildren),
        ]),
      ]);
    });
  };
}
