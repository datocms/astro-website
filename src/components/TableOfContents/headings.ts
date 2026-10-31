import { isDocument, isHeading, type Heading } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';

/** The table shows only when the content has more headings than this. */
const MIN_HEADINGS = 4;

/** One link of the table: the id of the heading in the page, its text and its level (2 for an h2). */
export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

/**
 * The links for a document that is not a Structured Text field (Markdown,
 * HTML). Gives an empty list when the document has too few headings.
 */
export function tableOfContentsItems(items: TableOfContentsItem[]) {
  return items.length > MIN_HEADINGS ? items : [];
}

/**
 * The headings of a Structured Text field, at all levels, in their order.
 * Gives an empty list when the field has too few headings for a table.
 */
export function tableOfContentsHeadings(content: { value: unknown } | null | undefined) {
  if (!isDocument(content?.value)) return [];
  const headings = filterNodes(content.value.document, isHeading) as Heading[];
  return headings.length > MIN_HEADINGS ? headings : [];
}
