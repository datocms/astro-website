import type { Parent, Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

type AnyDirective = ContainerDirective | LeafDirective | TextDirective;

function isDirective(node: unknown): node is AnyDirective {
  return (
    !!node &&
    typeof node === 'object' &&
    'type' in node &&
    (node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective')
  );
}

function directivePrefix(node: AnyDirective): string {
  if (node.type === 'textDirective') return ':';
  if (node.type === 'leafDirective') return '::';
  return ':::';
}

/**
 * Parses `::::tabs` / `:::tab[Title]` container directives (from
 * remark-directive) into `<tabs-placeholder>` / `<tab-placeholder>` HAST
 * elements that `parseTabsInHtml` later replaces with the `Tabs`/`Tab`
 * Astro components.
 *
 * Any other directive (e.g. an accidental `:foo` from `(1:1)`) is
 * reconstructed back to plain text so it doesn't end up as an empty `<div>`
 * via mdast-util-to-hast's default unknown directive handler.
 */
export function remarkTabs() {
  return function transformer(tree: Root) {
    const strayDirectives: Array<{
      parent: Parent;
      index: number;
      node: AnyDirective;
    }> = [];

    visit(tree, (node, index, parent) => {
      if (!isDirective(node)) return;

      if (node.type === 'containerDirective' && node.name === 'tabs') {
        const data = node.data || (node.data = {});
        data.hName = 'tabs-placeholder';
        data.hProperties = {};
        return;
      }

      if (node.type === 'containerDirective' && node.name === 'tab') {
        let title = '';
        const first = node.children[0];
        if (
          first &&
          first.type === 'paragraph' &&
          (first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel
        ) {
          title = toString(first);
          node.children = node.children.slice(1);
        }

        const data = node.data || (node.data = {});
        data.hName = 'tab-placeholder';
        data.hProperties = { 'data-title': title };
        return;
      }

      if (parent && typeof index === 'number') {
        strayDirectives.push({ parent, index, node });
      }
    });

    for (const { parent, index, node } of strayDirectives) {
      parent.children[index] = {
        type: 'text',
        value: directivePrefix(node) + node.name,
      };
    }
  };
}
