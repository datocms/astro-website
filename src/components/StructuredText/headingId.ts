import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import type { Heading } from 'datocms-structured-text-utils';
import { slugify } from '~/lib/slugify';

/**
 * The id of a heading. HeadingNode gives it to the heading, and
 * TableOfContents links to it: both must use this function.
 */
export function headingId(node: Heading) {
  return slugify(toPlainText(node));
}
