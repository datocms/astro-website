import { stripStega } from '@datocms/astro';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
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

/** The data of a quote that every size of quote shows. */
export interface QuoteData {
  /** The full quote, with typographic marks. A line break separates the paragraphs. */
  text: string;
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

/*
 * The quote becomes a string, because the typographic pass changes the
 * text. The stega of Content Link stays in the string, thus Content Link
 * works in draft mode.
 */
function quoteText(quote: { value: unknown }) {
  const text = toPlainText(quote.value as Parameters<typeof toPlainText>[0]) ?? '';
  return typographic(text.trim().replace(/\n{2,}/g, '\n'));
}

/*
 * The cast removes `__typename` from the type of the item: `readFragment`
 * reads only the type of the fragment.
 */
export function readQuote(item: QuoteItem): QuoteData {
  if (item.__typename === 'ReviewRecord') {
    const data = readFragment(QuoteReviewFragment, item as FragmentOf<typeof QuoteReviewFragment>);
    const website = data.website?.trim() || null;
    const profile = website !== null && isProfile(website);
    const company = data.company?.trim() || null;
    return {
      text: quoteText(data.quote),
      excerpt: data.excerpt ? typographic(data.excerpt) : null,
      name: data.name ?? '',
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
    text: quoteText(data.quote),
    excerpt: data.excerpt ? typographic(data.excerpt) : null,
    name: data.name,
    role: data.role?.trim() || null,
    company: partner?.name ?? null,
    companyHref: partner ? buildUrlForPartner(partner) : null,
    nameHref: null,
    image: data.image?.responsiveImage ?? null,
  };
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
