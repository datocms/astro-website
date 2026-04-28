/// <reference types="mdast-util-directive" />

import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { InclusiveDescendant } from '@flex-development/unist-util-types';
import { forEachNode } from 'datocms-structured-text-utils';
import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { parse, type HTMLElement } from 'node-html-parser';
import remarkDirective from 'remark-directive';
import { config as baseConfig } from '~/components/Markdown/utils';
import { invariant } from '~/lib/invariant';

type AnyDirective = TextDirective | LeafDirective | ContainerDirective;

function isDirective(node: InclusiveDescendant<Root>): node is AnyDirective {
  return (
    !!node &&
    (node.type === 'textDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'containerDirective')
  );
}

function isExample(node: InclusiveDescendant<Root>): node is LeafDirective {
  return !!node && node.type === 'leafDirective' && node.name === 'example';
}

function directivePrefix(node: AnyDirective): string {
  if (node.type === 'textDirective') return ':';
  if (node.type === 'leafDirective') return '::';
  return ':::';
}

export function findExamplesInHyperschema() {
  return async function transformer(tree: Root) {
    const exampleOccurrences: Array<{
      parent: InclusiveDescendant<Root>;
      index: number;
      exampleId: string;
      isAlone: boolean;
    }> = [];

    const strayDirectives: Array<{
      parent: InclusiveDescendant<Root>;
      index: number;
      node: AnyDirective;
    }> = [];

    forEachNode(tree, (node, parent) => {
      if (!parent) return;
      const index = parent.children.indexOf(node as any);
      if (index < 0) return;

      if (isExample(node)) {
        const previousNode = index === 0 ? null : parent.children[index - 1];
        const nextNode = index === parent.children.length - 1 ? null : parent.children[index + 1];

        node.data = {};
        node.data.hName = 'example';

        invariant(node.children[0] && 'value' in node.children[0]);

        const exampleId = node.children[0].value.trim();
        const isAlone =
          (!previousNode || !isExample(previousNode)) && (!nextNode || !isExample(nextNode));

        exampleOccurrences.push({ parent, index, exampleId, isAlone });
      } else if (isDirective(node)) {
        strayDirectives.push({ parent, index, node });
      }
    });

    for (const { parent, index, exampleId, isAlone } of exampleOccurrences) {
      const rawNode = {
        type: 'html',
        value: `<example id="${exampleId}" ${isAlone ? `alone` : ''}></example>`,
      };

      (parent as any).children[index] = rawNode;
    }

    // Reconstruct any non-example directive (e.g. accidental `:foo` from things
    // like `(1:1)`) back into plain text, otherwise mdast-util-to-hast's default
    // unknown handler renders them as `<div></div>`.
    for (const { parent, index, node } of strayDirectives) {
      (parent as any).children[index] = {
        type: 'text',
        value: directivePrefix(node) + node.name,
      };
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

  // If there's already a <body>, use it; otherwise treat the root
  // as our container so that examples keep working
  const containerElement: HTMLElement = (root.querySelector('body') as HTMLElement) ?? root;

  const items: ParsedItem[] = [];
  let buffer = '';

  const flushBuffer = () => {
    if (buffer.trim()) {
      items.push({ type: 'html', content: buffer });
      buffer = '';
    }
  };

  containerElement.childNodes.forEach((node) => {
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
