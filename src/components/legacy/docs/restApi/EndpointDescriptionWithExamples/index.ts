import { forEachNode } from 'datocms-structured-text-utils';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { slugify } from '~/lib/slugify';
import type { TocEntry, TocGroup } from '../../ContentPlusToc/types';
import type { RestApiEndpointJsExample } from '../types';

export { default as EndpointDescriptionWithExamples } from './Component.astro';

export const examplePlaceholderRegexp = /(<p>\n*)?::example\[(?<exampleId>[^\]]+)\](\n*<\/p>)?/g;

export function exampleIdsInMarkdown(content: string | undefined) {
  return content
    ? [...content.matchAll(examplePlaceholderRegexp)].map((match) => match.groups!.exampleId!)
    : [];
}

export function examplesInMarkdown<T extends Array<{ id: string }>>(
  examples: T,
  content: string | undefined,
): T {
  const exampleIdsInside = exampleIdsInMarkdown(content);

  return exampleIdsInside
    .map((id) => examples.find((example) => example.id === id))
    .filter(Boolean) as T;
}

export function examplesNotInMarkdown<T extends Array<{ id: string }>>(
  examples: T,
  content: string | undefined,
): T {
  const exampleIdsInside = exampleIdsInMarkdown(content);

  return examples.filter((example) => !exampleIdsInside.includes(example.id)) as T;
}

export function buildTocGroupsFromMarkdown(rawContent: string | undefined): TocGroup[] {
  const content = rawContent || '';
  const processor = unified().use(remarkParse);
  const tree = processor.parse(content);

  const headings: TocEntry[] = [];

  forEachNode(tree, (node) => {
    if (node.type === 'heading' && node.depth !== 6) {
      const content = toString(node);

      headings.push({
        label: content,
        url: `#${slugify(content)}`,
      });
    }
  });

  if (headings.length === 0) {
    return [];
  }

  return [
    {
      title: 'Sections',
      entries: headings,
    },
  ];
}

export function buildTocGroupsFromExamples(
  examples: RestApiEndpointJsExample[],
  content: string | undefined,
) {
  const headings: TocEntry[] = [];

  for (const example of examplesInMarkdown(examples, content)) {
    headings.push({
      label: example.title,
      url: `#${example.id}`,
    });
  }

  for (const example of examplesNotInMarkdown(examples, content)) {
    headings.push({
      label: example.title,
      url: `#${example.id}`,
    });
  }

  if (examples.length === 0) {
    headings.push({
      label: 'Basic example',
      url: `#basic-example`,
    });
  }

  if (headings.length === 0) {
    return [];
  }

  return [
    {
      title: 'Available examples',
      entries: headings,
    },
  ];
}
