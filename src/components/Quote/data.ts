import { stripStega } from '@datocms/astro';
import type { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { buildUrlForPartner } from '~/lib/datocms/gqlUrlBuilder/partner';
import { readFragment, type FragmentOf } from '~/lib/datocms/graphql';
import { QuotePartnerTestimonialFragment, QuoteReviewFragment } from './graphql';

/** A review or the testimonial of a partner, with `__typename` next to the fragment. */
export type QuoteItem =
  | ({ __typename: 'ReviewRecord' } & FragmentOf<typeof QuoteReviewFragment>)
  | ({ __typename: 'PartnerTestimonialRecord' } & FragmentOf<
      typeof QuotePartnerTestimonialFragment
    >);

/** A part of a line of the quote. `highlight` is the highlight mark of the CMS. */
export interface QuoteRun {
  text: string;
  highlight: boolean;
}

/** The data of a quote that every size of quote shows. */
export interface QuoteData {
  /** The full quote, with typographic marks. A line break separates the paragraphs. */
  text: string;
  /** The same text as `text`, one item for each line, with the highlights. */
  lines: QuoteRun[][];
  /** The excerpt, with typographic marks. */
  excerpt: string | null;
  name: string;
  role: string | null;
  company: string | null;
  /** The link of the company: its website, or the page of the partner. */
  companyHref: string | null;
  /** The link of the person: a profile on a social network, when the website is one. */
  nameHref: string | null;
  image: FragmentOf<typeof ResponsiveImageFragment> | null;
}

/** The longest quote that a statement shows in full. A longer quote needs an excerpt. */
export const STATEMENT_MAX = 120;

/* A website on one of these hosts is the profile of a person, not the site of a company. */
const PROFILE_HOSTS = ['twitter.com', 'x.com', 'linkedin.com', 'github.com', 'bsky.app'];

/*
 * The website as an absolute http(s) link. A website without a scheme
 * ("example.com") gets https. Other values give no link: a relative href
 * goes to a page of this site, and a javascript: href is not safe.
 */
function safeHref(value: string | null | undefined) {
  const url = stripStega(value ?? '').trim();
  if (!url) return null;
  try {
    const parsed = new URL(/^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.')
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

function isProfile(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return PROFILE_HOSTS.includes(host);
  } catch {
    return false;
  }
}

/*
 * The quote is in curly double marks, thus the inner quotes become curly
 * single marks. Each straight apostrophe becomes a curly one. The CMS keeps
 * the text as the person wrote it.
 */
export function typographic(text: string) {
  return text.replace(/"([^"]*)"/g, '‘$1’').replaceAll("'", '’');
}

/* The nodes of the Structured Text of a quote that give its text. */
interface TextNode {
  type: string;
  value?: string;
  marks?: string[];
  children?: TextNode[];
}

/*
 * The lines of the quote: one line for each paragraph (and for each line
 * break in a span), with the highlighted parts. The typographic pass runs
 * on all the text, because a pair of quote marks can be in two parts. It
 * changes one character into one character, thus the parts keep their
 * places. The stega of Content Link stays in the text, thus Content Link
 * works in draft mode.
 */
function quoteLines(quote: { value: unknown } | null): QuoteRun[][] {
  if (!quote) return [];
  const runs: QuoteRun[] = [];
  const walk = (node: TextNode) => {
    if (node.type === 'span') {
      runs.push({ text: node.value ?? '', highlight: node.marks?.includes('highlight') ?? false });
      return;
    }
    if ((node.type === 'paragraph' || node.type === 'heading') && runs.length > 0) {
      runs.push({ text: '\n', highlight: false });
    }
    node.children?.forEach(walk);
  };
  walk((quote.value as { document: TextNode }).document);

  const all = typographic(runs.map((run) => run.text).join(''));
  const lines: QuoteRun[][] = [[]];
  let at = 0;
  for (const run of runs) {
    const text = all.slice(at, (at += run.text.length));
    text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines.at(-1)!.push({ text: part, highlight: run.highlight });
    });
  }
  return lines.map(trimLine).filter((line) => line.length > 0);
}

/* Remove the spaces at the start and at the end of a line, and the empty parts. */
function trimLine(line: QuoteRun[]) {
  const runs = line.map((run) => ({ ...run }));
  const first = runs.at(0);
  const last = runs.at(-1);
  if (first) first.text = first.text.trimStart();
  if (last) last.text = last.text.trimEnd();
  return runs.filter((run) => run.text);
}

/* The data of the text of a quote: the lines, and the lines as one string. */
function quoteText(quote: { value: unknown } | null) {
  const lines = quoteLines(quote);
  return { lines, text: lines.map((line) => line.map((run) => run.text).join('')).join('\n') };
}

/*
 * The cast removes `__typename` from the type of the item: `readFragment`
 * reads only the type of the fragment.
 */
export function readQuote(item: QuoteItem): QuoteData {
  if (item.__typename === 'ReviewRecord') {
    const data = readFragment(QuoteReviewFragment, item as FragmentOf<typeof QuoteReviewFragment>);
    const website = safeHref(data.website);
    const profile = website !== null && isProfile(website);
    const company = data.company?.trim() || null;
    return {
      ...quoteText(data.quote),
      excerpt: data.excerpt ? typographic(data.excerpt) : null,
      name: data.name?.trim() ?? '',
      role: data.role?.trim() || null,
      company,
      companyHref: company && website && !profile ? website : null,
      // Without a company, the website of the person (a profile or a
      // personal site) is the link of the name.
      nameHref: website && (profile || !company) ? website : null,
      image: data.image.responsiveImage,
    };
  }

  const data = readFragment(
    QuotePartnerTestimonialFragment,
    item as FragmentOf<typeof QuotePartnerTestimonialFragment>,
  );
  const { partner } = data;
  return {
    ...quoteText(data.quote),
    excerpt: data.excerpt ? typographic(data.excerpt) : null,
    name: data.name.trim(),
    role: data.role?.trim() || null,
    company: partner?.name ?? null,
    companyHref: partner ? buildUrlForPartner(partner) : null,
    nameHref: null,
    image: data.image?.responsiveImage ?? null,
  };
}

/** A quote shows only with its text. Without stega, the text has at least one letter. */
export function hasText(quote: QuoteData) {
  return /\p{L}/u.test(stripStega(quote.text));
}

/**
 * The text of a statement: the excerpt, or the full quote when it is
 * short. Without one of them the quote is too long for a statement.
 */
export function statementText(quote: QuoteData) {
  if (quote.excerpt) return quote.excerpt;
  // In draft mode the text has stega: remove it before the count.
  return stripStega(quote.text).length <= STATEMENT_MAX ? quote.text : null;
}
