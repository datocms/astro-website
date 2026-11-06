import { stripStega } from '@datocms/astro';
import type { Element, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { selectAll } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';
import { toString } from 'hast-util-to-string';
import { untrustedMarkdownToHtml } from '~/components/Markdown/utils';
import { tableOfContentsItems, type TableOfContentsItem } from '~/components/TableOfContents';

export interface Readme {
  /** The HTML of the README, ready for Prose. Empty when the README has no text. */
  html: string;
  /** The links of the table of contents. Empty when the README has few headings. */
  toc: TableOfContentsItem[];
}

const HEADING = /^h([1-6])$/;

function level(node: Element) {
  return Number(HEADING.exec(node.tagName)?.[1] ?? 0);
}

/** The first element of the tree, at the top level. */
function firstElement(tree: Root) {
  return tree.children.find((child): child is Element => child.type === 'element');
}

/**
 * Makes a README fit a page (a plugin, a starter). The README comes from a
 * repository, thus its form is not known, and its HTML is not trusted:
 *
 * - The first heading goes when it is an h1 at the top: it is usually the
 *   name of the project, and the hero already shows the name.
 * - The headings move, thus the highest one is an h2. The h1 of the page
 *   stays the name of the project.
 * - The table of contents gets the h2 and h3 headings.
 * - The images load lazily.
 */
export async function prepareReadme(markdown: string | null | undefined): Promise<Readme> {
  if (!markdown?.trim()) return { html: '', toc: [] };

  const tree = fromHtml(await untrustedMarkdownToHtml(markdown), { fragment: true });

  const first = firstElement(tree);
  if (first && level(first) === 1) {
    tree.children.splice(tree.children.indexOf(first), 1);
  }

  const headings = selectAll('h1, h2, h3, h4, h5, h6', tree);
  const top = Math.min(...headings.map(level));
  const shift = headings.length > 0 ? 2 - top : 0;

  for (const heading of headings) {
    heading.tagName = `h${Math.min(6, level(heading) + shift)}`;
  }

  // autolinkHeadings gives each heading its id.
  const toc = headings.flatMap((heading) => {
    const id = heading.properties['id'];
    const text = toString(heading).trim();
    const headingLevel = level(heading);
    return typeof id === 'string' && text && headingLevel <= 3
      ? [{ id, text, level: headingLevel }]
      : [];
  });

  for (const image of selectAll('img', tree)) {
    image.properties['loading'] = 'lazy';
    image.properties['decoding'] = 'async';
  }

  // In draft mode the README ends with the invisible characters of Content
  // Link. They are not content.
  const hasContent = stripStega(toString(tree)).trim() !== '' || selectAll('img', tree).length > 0;
  const html = hasContent ? toHtml(tree) : '';

  return { html, toc: tableOfContentsItems(toc) };
}
