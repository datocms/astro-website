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
const sources = import.meta.glob<string>(
  ['../{components,data,pages,layouts,scenes}/**/*.{astro,ts,tsx}', '!**/*.test.ts'],
  { query: '?raw', import: 'default', eager: true },
);

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

/** Each `face` of the copy of src/data, with its path. The features buddy has its own faces. */
function dataFaces(
  value: unknown,
  path: string,
  out: [string, string][],
  seen = new Set<unknown>(),
) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  for (const [key, child] of Object.entries(value)) {
    if (key === 'buddy') continue;
    if (key === 'face' && typeof child === 'string') out.push([path, child]);
    dataFaces(child, `${path}.${key}`, out, seen);
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

/**
 * The library has more than 30 faces: each page gets its own. A face can
 * come back once, on a different page.
 */
const MAX_FACE_USES = 2;

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

  it(`uses each face ${MAX_FACE_USES} times or less`, () => {
    // The faces of src/data, and the literal faces of src/pages (closers
    // and heroes). The pages of one template (cms-*.ts) are one use.
    const uses = [
      ...Object.entries(modules).flatMap(([file, module]) =>
        dataFaces(module, file.replace('../data/', '').replace(/^cms-[^.]+\.ts$/, 'cms-*'), []).map(
          // One data file is one page: a face that it gives twice (home.hero
          // and home.homeHero) is one use.
          ([path, face]) => [path.split('.ts')[0]!, face] as const,
        ),
      ),
      ...Object.entries(pages).flatMap(([file, source]) =>
        [...source.matchAll(/\sface="([a-z]+)"/g)].map((m) => [file, m[1]!] as const),
      ),
    ];
    const where = new Map<string, Set<string>>();
    for (const [path, face] of uses) {
      where.set(face, (where.get(face) ?? new Set()).add(path));
    }
    const over = [...where]
      .filter(([, paths]) => paths.size > MAX_FACE_USES)
      .map(([face, paths]) => `${face}: ${[...paths].join(', ')}`);
    expect(over).toEqual([]);
  });

  it('animates each face: no face glyphs in the copy or in the markup', () => {
    // The copy and the components give the name of a face. The glyphs come
    // from src/lib/motion/faces.ts, with their animation (the Face
    // component, or a face step of a typewriter script). These components
    // have their own animation of a face.
    const ownAnimation = [
      'src/components/PageCloser/Component.astro',
      'src/components/QuestionAnswer/Component.astro',
      'src/components/Community/Component.astro',
    ];
    const glyphs = /\\?\[[^\[\]\s'"`]{0,2}[•°○♥■¬ᴗ﹏✓$@][^\[\]\s'"`]{0,3}\]|\[x_x\]/;
    const found = Object.entries(sources)
      .map(([file, source]) => [file.replace('../', 'src/'), source] as const)
      .filter(([file]) => !ownAnimation.includes(file))
      .flatMap(([file, source]) =>
        source
          .split('\n')
          .map((line, i) => [line, i + 1] as const)
          .filter(([line]) => !/^\s*(\*|\/\/|\/\*)/.test(line) && glyphs.test(line))
          .map(([line, n]) => `${file}:${n}: ${line.trim()}`),
      );
    expect(found).toEqual([]);
  });

  it('reads the glyphs of a face only where they play', () => {
    // These files show the glyphs of a face (`faces[name].face`) as the
    // final text of a typewriter script that plays the face, each time.
    // Each other component shows a face with <Face name="…">, which always
    // plays it. Before you add a file here, make sure that each branch of
    // the file plays the face (a Hero without the typewriter uses <Face>).
    const animates = [
      'src/components/Face/Component.astro',
      'src/components/Hero/Component.astro',
      'src/components/HomeHero/Component.astro',
      'src/components/NotFoundSection/Component.astro',
      'src/components/ListBuddy/Component.astro',
    ];
    const readers = Object.entries(sources)
      .filter(([, source]) => /\bfaces\[/.test(source))
      .map(([file]) => file.replace('../', 'src/'))
      .filter((file) => !animates.includes(file));
    expect(readers).toEqual([]);
  });
});
