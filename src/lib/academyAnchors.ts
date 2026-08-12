import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isHeading, type Heading, type Node } from 'datocms-structured-text-utils';
import { filterNodes } from '~/lib/datocms/filterNodes';
import { slugify } from '~/lib/slugify';

const anchors = new WeakMap<Heading, string>();

function baseAnchor(heading: Heading) {
  return slugify(toPlainText(heading) ?? '') ?? '';
}

export function assignHeadingAnchors(document: Node) {
  const headings = filterNodes(document, (node): node is Heading => isHeading(node));
  const occurrences = new Map<string, number>();

  return headings.map((heading) => {
    const base = baseAnchor(heading);
    const occurrence = (occurrences.get(base) ?? 0) + 1;

    occurrences.set(base, occurrence);

    const anchor = occurrence === 1 ? base : `${base}-${occurrence}`;

    anchors.set(heading, anchor);

    return { heading, anchor };
  });
}

export function headingAnchor(heading: Heading) {
  return anchors.get(heading) ?? baseAnchor(heading);
}
