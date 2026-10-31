import {
  render as toPlainText,
  type StructuredTextDocument,
} from 'datocms-structured-text-to-plain-text';
import { isHeading, type Heading } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';
import { slugify } from '~/lib/slugify';
import type { TocGroup } from './types';

export function buildGroupsFromHeadings(structuredTextValue: unknown): TocGroup[] {
  const entries = filterNodes(
    (structuredTextValue as StructuredTextDocument).document,
    (node): node is Heading => isHeading(node) && node.level !== 6,
  ).map((heading) => {
    const innerText = toPlainText(heading)!;

    return {
      url: `#${slugify(innerText)}`,
      label: innerText,
    };
  });

  if (entries.length === 0) {
    return [];
  }

  return [
    {
      title: 'In this page',
      entries,
    },
  ];
}
