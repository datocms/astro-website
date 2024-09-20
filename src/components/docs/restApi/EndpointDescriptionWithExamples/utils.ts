/// <reference types="mdast-util-directive" />

import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { InclusiveDescendant } from '@flex-development/unist-util-types';
import type { Root } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { config as baseConfig } from '~/components/Markdown/utils';
import { invariant } from '~/lib/invariant';

type ExampleRenderFn = (exampleId: string, isAlone: boolean) => Promise<string>;

function isExample(node: InclusiveDescendant<Root>): node is LeafDirective {
  return !!node && node.type === 'leafDirective' && node.name === 'example';
}

export function findExamplesInHyperschema(exampleRenderer: ExampleRenderFn) {
  return async function transformer(tree: Root) {
    const occurrences: Array<{
      parent: InclusiveDescendant<Root>;
      index: number;
      exampleId: string;
      isAlone: boolean;
    }> = [];

    visit(tree, (node, index, parent) => {
      if (index && parent && isExample(node)) {
        const previousNode = index === 0 ? null : parent.children[index - 1];

        const nextNode = index === parent.children.length - 1 ? null : parent.children[index + 1];

        node.data = {};
        node.data.hName = 'example';

        invariant(node.children[0] && 'value' in node.children[0]);

        const exampleId = node.children[0].value;
        const isAlone =
          (!previousNode || !isExample(previousNode)) && (!nextNode || !isExample(nextNode));

        occurrences.push({ parent, index, exampleId, isAlone });
      }
    });

    for (const { parent, index, exampleId, isAlone } of occurrences) {
      const rawNode = {
        type: 'html',
        value: await exampleRenderer(exampleId, isAlone),
      };

      (parent as any).children[index] = rawNode;
    }
  };
}

export async function markdownWithExamples(content: string, renderer: ExampleRenderFn) {
  const processor = await createMarkdownProcessor({
    ...baseConfig,
    remarkPlugins: [
      ...(baseConfig.remarkPlugins || []),
      remarkDirective,
      [findExamplesInHyperschema, renderer],
    ],
  });
  const result = await processor.render(content);
  return result.code;
}
