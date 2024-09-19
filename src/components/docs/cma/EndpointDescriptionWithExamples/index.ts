import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { slugify } from '~/lib/slugify';
import type { TocEntry, TocGroup } from '../../ContentPlusToc/types';
import type { CmaEndpointJsExample } from '../types';

export { default as EndpointDescriptionWithExamples } from './Component.astro';

export const examplePlaceholderRegexp = /(<p>\n*)?::example\[(?<exampleId>[^\]]+)\](\n*<\/p>)?/g;

export function exampleIdsInMarkdown(content: string | undefined) {
  return content
    ? [...content.matchAll(examplePlaceholderRegexp)].map((match) => match.groups!.exampleId)
    : [];
}

export function examplesNotInMarkdown(
  examples: CmaEndpointJsExample[],
  content: string | undefined,
): CmaEndpointJsExample[] {
  const exampleIdsInside = exampleIdsInMarkdown(content);

  return examples.filter((example) => !exampleIdsInside.includes(example.id));
}

export function buildTocGroupsFromMarkdown(
  content: string | undefined,
  examples?: CmaEndpointJsExample[],
): TocGroup[] {
  if (!content) {
    return [];
  }

  const processor = unified().use(remarkParse);
  const tree = processor.parse(content);

  const headings: TocEntry[] = [];

  visit(tree, ['heading', 'paragraph'], (node) => {
    if (node.type === 'heading') {
      const content = toString(node);

      headings.push({
        label: content,
        url: `#${slugify(content)}`,
      });
    }

    if (examples) {
      if (node.type === 'paragraph') {
        const content = toString(node);

        const exampleIds = [...content.matchAll(examplePlaceholderRegexp)].map(
          (match) => match.groups!.exampleId!,
        );

        for (const exampleId of exampleIds) {
          const example = examples.find((e) => e.id === exampleId);

          if (example) {
            headings.push({
              label: example.title,
              url: `#${exampleId}`,
              badge: 'Example',
            });
          }
        }
      }
    }
  });

  if (examples) {
    for (const example of examplesNotInMarkdown(examples, content)) {
      headings.push({
        label: example.title,
        url: `#${example.id}`,
        badge: 'Example',
      });
    }

    if (examples.length === 0) {
      headings.push({
        label: 'Basic example',
        url: `#basic-example`,
        badge: 'Example',
      });
    }
  }

  if (headings.length === 0) {
    return [];
  }

  return [
    {
      title: 'In this page',
      entries: headings,
    },
  ];
}
