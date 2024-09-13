import {
  render as toPlainText,
  type StructuredTextDocument,
} from 'datocms-structured-text-to-plain-text';
import { isHeading, type Heading, type Node } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';
import { slugify } from '~/lib/slugify';
import type { Group } from './types';

export function buildGroupsFromHeadings(structuredTextValue: unknown): Group[] {
  return [
    {
      title: 'In this page',
      entries: filterNodes(
        (structuredTextValue as StructuredTextDocument).document,
        (n): n is Heading => isHeading(n as Node),
      ).map((heading) => {
        const innerText = toPlainText(heading)!;

        return {
          url: `#${slugify(innerText)}`,
          label: innerText,
        };
      }),
    },
  ];
}
