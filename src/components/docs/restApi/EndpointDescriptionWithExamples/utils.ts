/// <reference types="mdast-util-directive" />

import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { InclusiveDescendant } from '@flex-development/unist-util-types';
import { forEachNode } from 'datocms-structured-text-utils';
import type { Root } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import { parse, type HTMLElement } from 'node-html-parser';
import remarkDirective from 'remark-directive';
import { config as baseConfig } from '~/components/Markdown/utils';
import { invariant } from '~/lib/invariant';

function isExample(node: InclusiveDescendant<Root>): node is LeafDirective {
  return !!node && node.type === 'leafDirective' && node.name === 'example';
}

export function findExamplesInHyperschema() {
  return async function transformer(tree: Root) {
    const occurrences: Array<{
      parent: InclusiveDescendant<Root>;
      index: number;
      exampleId: string;
      isAlone: boolean;
    }> = [];

    forEachNode(tree, (node, parent) => {
      const index = parent ? parent.children.indexOf(node as any) : undefined;

      if (index && parent && isExample(node)) {
        const previousNode = index === 0 ? null : parent.children[index - 1];

        const nextNode = index === parent.children.length - 1 ? null : parent.children[index + 1];

        node.data = {};
        node.data.hName = 'example';

        invariant(node.children[0] && 'value' in node.children[0]);

        const exampleId = node.children[0].value.trim();
        const isAlone =
          (!previousNode || !isExample(previousNode)) && (!nextNode || !isExample(nextNode));

        occurrences.push({ parent, index, exampleId, isAlone });
      }
    });

    for (const { parent, index, exampleId, isAlone } of occurrences) {
      const rawNode = {
        type: 'html',
        // value: await exampleRenderer(exampleId, isAlone),
        value: `<example id="${exampleId}" ${isAlone ? `alone` : ''}></example>`,
      };

      (parent as any).children[index] = rawNode;
    }
  };
}

export async function markdownWithExamples(content: string) {
  const processor = await createMarkdownProcessor({
    ...baseConfig,
    remarkPlugins: [
      ...(baseConfig.remarkPlugins || []),
      remarkDirective,
      findExamplesInHyperschema,
    ],
  });
  const result = await processor.render(content);

  return result.code;
}

type ParsedItem =
  | { type: 'html'; content: string }
  | { type: 'example'; id: string; alone?: boolean };

export function parseHtmlWithExamples(html: string): ParsedItem[] {
  const root = parse(html);
  const body = root.querySelector('body');

  if (!body) {
    return [];
  }

  const items: ParsedItem[] = [];
  let buffer = '';

  const flushBuffer = () => {
    if (buffer.trim()) {
      items.push({ type: 'html', content: buffer });
      buffer = '';
    }
  };

  body.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      // Element node - cast to HTMLElement
      const element = node as HTMLElement;

      if (element.tagName.toLowerCase() === 'example') {
        // Flush any accumulated HTML
        flushBuffer();

        const id = element.getAttribute('id');
        if (!id) return;
        const alone = element.hasAttribute('alone');

        items.push({ type: 'example', id, ...(alone ? { alone: true } : {}) });
      } else {
        // Other element nodes: include full outer HTML
        buffer += element.outerHTML;
      }
    } else if (node.nodeType === 3) {
      // Text nodes: include text content
      buffer += node.textContent;
    }
    // Other node types (e.g., comments) are ignored
  });

  // Flush remaining buffer
  flushBuffer();

  return items;
}
