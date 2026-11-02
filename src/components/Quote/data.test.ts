import { describe, expect, it } from 'vitest';
import { hasText, readQuote, statementText, type QuoteItem } from './data.ts';

/* A quote in the shape of the CDA: a root with one paragraph. */
function dast(text: string) {
  return {
    value: {
      schema: 'dast',
      document: {
        type: 'root',
        children: text ? [{ type: 'paragraph', children: [{ type: 'span', value: text }] }] : [],
      },
    },
  };
}

function review(fields: Record<string, unknown> = {}) {
  return readQuote({
    __typename: 'ReviewRecord',
    name: 'Ann Lee',
    role: 'CTO',
    company: 'Acme',
    website: null,
    excerpt: null,
    quote: dast('It is "fast", and it\'s simple.'),
    image: { responsiveImage: null },
    ...fields,
  } as unknown as QuoteItem);
}

describe('readQuote()', () => {
  it('changes straight marks to typographic marks', () => {
    expect(review().text).toBe('It is ‘fast’, and it’s simple.');
  });

  it('adds https to a website without a scheme', () => {
    expect(review({ website: 'acme.com' }).companyHref).toBe('https://acme.com/');
  });

  it('gives no link for a website that is not an http(s) URL', () => {
    for (const website of ['javascript:alert(1)', '/pricing', 'not a url', 'mailto:a@b.co']) {
      const quote = review({ website });
      expect([quote.companyHref, quote.nameHref]).toEqual([null, null]);
    }
  });

  it('links the name, not the company, to a social profile', () => {
    const quote = review({ website: 'https://www.linkedin.com/in/ann' });
    expect([quote.companyHref, quote.nameHref]).toEqual([null, 'https://www.linkedin.com/in/ann']);
  });

  it('links the name to the website when there is no company', () => {
    const quote = review({ company: null, website: 'https://ann.dev' });
    expect([quote.companyHref, quote.nameHref]).toEqual([null, 'https://ann.dev/']);
  });

  it('trims the name, the role and the company', () => {
    const quote = review({ name: '  Ann  ', role: ' ', company: '' });
    expect([quote.name, quote.role, quote.company]).toEqual(['Ann', null, null]);
  });
});

describe('hasText()', () => {
  it('is false for an empty or a missing quote', () => {
    expect(hasText(review({ quote: dast('') }))).toBe(false);
    expect(hasText(review({ quote: null }))).toBe(false);
  });

  it('is true for a quote with words', () => {
    expect(hasText(review())).toBe(true);
  });
});

describe('statementText()', () => {
  it('gives the excerpt when there is one', () => {
    expect(statementText(review({ excerpt: 'Short.' }))).toBe('Short.');
  });

  it('gives the full quote when it is short', () => {
    expect(statementText(review())).toBe('It is ‘fast’, and it’s simple.');
  });

  it('gives nothing for a long quote without an excerpt', () => {
    expect(statementText(review({ quote: dast('word '.repeat(40)) }))).toBeNull();
  });
});
