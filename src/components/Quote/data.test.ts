import { describe, expect, it } from 'vitest';
import { hasText, readQuote, type QuoteItem } from './data.ts';

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

describe('the lines of the quote', () => {
  const spans = (...children: Array<{ value: string; marks?: string[] }>) => ({
    value: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [{ type: 'paragraph', children: children.map((c) => ({ type: 'span', ...c })) }],
      },
    },
  });

  it('keeps the highlight of the CMS', () => {
    const quote = review({
      quote: spans(
        { value: 'It is ' },
        { value: 'very fast', marks: ['highlight'] },
        { value: '.' },
      ),
    });
    expect(quote.lines).toEqual([
      [
        { text: 'It is ', highlight: false },
        { text: 'very fast', highlight: true },
        { text: '.', highlight: false },
      ],
    ]);
    expect(quote.text).toBe('It is very fast.');
  });

  it('changes a pair of quote marks across two parts', () => {
    const quote = review({
      quote: spans({ value: 'We said "it is ' }, { value: 'fast"', marks: ['highlight'] }),
    });
    expect(quote.text).toBe('We said ‘it is fast’');
    expect(quote.lines[0]?.[1]).toEqual({ text: 'fast’', highlight: true });
  });

  it('gives one line for each paragraph, without the spaces at the ends', () => {
    const quote = review({
      quote: {
        value: {
          schema: 'dast',
          document: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'span', value: ' One. ' }] },
              { type: 'paragraph', children: [{ type: 'span', value: 'Two.\n' }] },
            ],
          },
        },
      },
    });
    expect(quote.text).toBe('One.\nTwo.');
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

describe('the stega of the quote', () => {
  // Invisible characters of the stega alphabet. The CDA puts them at the end
  // of the last span in draft mode.
  const stega = '​‌‍‌​';

  it('takes the stega out of the text', () => {
    const quote = review({ quote: dast(`It is fast. ${stega}`) });
    expect(quote.stega).toBe(stega);
    expect(quote.text).toBe('It is fast.');
    expect(quote.lines.at(-1)?.at(-1)?.text).toBe('It is fast.');
  });

  it('is empty without stega', () => {
    expect(review().stega).toBe('');
  });
});
