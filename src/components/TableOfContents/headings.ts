import { isDocument, isHeading, type Heading } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';

/** The table shows only when the content has more headings than this. */
const MIN_HEADINGS = 4;

/**
 * The headings of a Structured Text field, at all levels, in their order.
 * Gives an empty list when the field has too few headings for a table.
 */
export function tableOfContentsHeadings(content: { value: unknown } | null | undefined) {
  if (!isDocument(content?.value)) return [];
  const headings = filterNodes(content.value.document, isHeading) as Heading[];
  return headings.length > MIN_HEADINGS ? headings : [];
}
