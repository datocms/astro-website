/*
 * The rules of the heroes (DESIGN.md: "The Text Face Rule", "The Hero
 * Length Rule" and "Two-tone headline with typewriter"), for the copy of
 * src/data and the Hero calls of src/pages. The Hero component also warns
 * on the dev server, for text from the CMS.
 */
import { describe, expect, it } from 'vitest';
import { HERO_MAX_CHARS, faceFollowsSentence, heroLength } from '~/lib/hero';
import type { FaceName } from '~/lib/motion/faces';

const modules = import.meta.glob<Record<string, unknown>>('../data/*.ts', { eager: true });
const pages = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: true,
});

type H1 = { headline: string; subheadline?: string; face?: FaceName };

/** Each value named `hero` in the module, at any depth. */
function heroes(value: unknown, path: string, out: [string, H1][], seen = new Set<unknown>()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  for (const [key, child] of Object.entries(value)) {
    const here = `${path}.${key}`;
    if (key === 'hero' && child && typeof (child as H1).headline === 'string') {
      out.push([here, child as H1]);
    }
    heroes(child, here, out, seen);
  }
  return out;
}

const all = Object.entries(modules).flatMap(([file, module]) =>
  heroes(module, file.replace('../data/', '').replace('.ts', ''), []),
);

/** Each `<Hero …>` tag of each page, with the file. */
const heroTags = Object.entries(pages).flatMap(([file, source]) =>
  [...source.matchAll(/<Hero\b[\s\S]*?\/?>/g)].map(
    (m) => [file.replace('../', 'src/'), m[0]] as const,
  ),
);

/**
 * The pages with a typed hero: the marketing pages of PRODUCT.md that use
 * the Hero component. The home page has HomeHero, the 404 NotFoundSection.
 */
const MARKETING_HERO_PAGES = [
  'src/pages/ai/index.astro',
  'src/pages/case-studies/index.astro',
  'src/pages/cms/[slug]/index.astro',
  'src/pages/compare/[slug]/index.astro',
  'src/pages/developers/index.astro',
  'src/pages/editor-experience/index.astro',
  'src/pages/enterprise-headless-cms/index.astro',
  'src/pages/features/index.astro',
  'src/pages/media/index.astro',
  'src/pages/philosophy/index.astro',
  'src/pages/pricing/index.astro',
  'src/pages/wall/index.astro',
];

describe('hero copy', () => {
  it('finds the heroes', () => {
    expect(all.length).toBeGreaterThan(15);
    expect(heroTags.length).toBeGreaterThan(40);
  });

  it(`keeps each h1 at ${HERO_MAX_CHARS} characters or less`, () => {
    const over = all
      .map(([path, h1]) => [path, heroLength(h1)] as const)
      .filter(([, length]) => length > HERO_MAX_CHARS)
      .map(([path, length]) => `${path}: ${length}`);
    expect(over).toEqual([]);
  });

  it('gives a face only after a headline that is a full sentence', () => {
    const fromData = all
      .filter(([, h1]) => h1.face && !faceFollowsSentence(h1.headline))
      .map(([path, h1]) => `${path}: "${h1.headline}"`);
    // A Hero call of a page with a literal face and a literal headline.
    const fromPages = heroTags
      .filter(([, tag]) => /\sface="/.test(tag))
      .filter(([, tag]) => {
        const headline = tag.match(/\sheadline="([^"]*)"/)?.[1];
        return headline === undefined || !faceFollowsSentence(headline);
      })
      .map(([file]) => file);
    expect([...fromData, ...fromPages]).toEqual([]);
  });

  it('types the hero of each marketing page, and only there', () => {
    const typed = [
      ...new Set(heroTags.filter(([, tag]) => /\stypewriter[\s/>]/.test(tag)).map(([f]) => f)),
    ].sort();
    expect(typed).toEqual(MARKETING_HERO_PAGES);
  });
});
