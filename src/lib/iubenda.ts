import type { TableOfContentsItem } from '~/components/TableOfContents';
import { slugify } from '~/lib/slugify';

const h2Pattern = /<h2(?<attributes>[^>]*)>(?<inner>[\s\S]*?)<\/h2>/g;

function textOf(html: string) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Prepare the HTML of a policy that iubenda makes.
 *
 * - The page already has an h1. The h1 of iubenda becomes an h2.
 * - Inline styles go away: the style of the page decides the look.
 * - Each h2 gets an id when it has none. An id of iubenda stays, because
 *   the links of the policy point to it.
 *
 * It gives the changed HTML and the h2 headings for a table of contents.
 */
export function prepareIubendaHtml(html: string) {
  const items: TableOfContentsItem[] = [];
  const usedIds = new Set(Array.from(html.matchAll(/\sid="([^"]*)"/g), (match) => match[1]!));

  // The h1 is the title of the policy. The hero shows it, thus it is not in the table.
  const withoutStyles = html
    .replace(/<(\/?)h1>/g, '<$1h2>')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/<h2>(\s*Privacy Policy of[\s\S]*?)<\/h2>/, '<h2 data-no-toc>$1</h2>');

  const result = withoutStyles.replace(h2Pattern, (heading, attributes: string, inner: string) => {
    if (attributes.includes('data-no-toc')) return heading;
    const text = textOf(inner);
    let id = /\sid="([^"]*)"/.exec(attributes)?.[1];
    let output = heading;
    if (!id) {
      const base = slugify(text) ?? 'section';
      id = base;
      for (let n = 2; usedIds.has(id); n += 1) id = `${base}-${n}`;
      usedIds.add(id);
      output = `<h2${attributes} id="${id}">${inner}</h2>`;
    }
    items.push({ id, text, level: 2 });
    return output;
  });

  return { html: result.replace(/ data-no-toc/g, ''), items };
}
