/*
 * The Hero Length Rule (DESIGN.md, "Heroes"): the h1 of each hero in
 * src/data has HERO_MAX_CHARS characters at most. A description that is
 * longer goes in `intro`. The Hero component warns on the dev server for
 * text from the CMS.
 */
import { describe, expect, it } from 'vitest';
import { HERO_MAX_CHARS, heroLength } from '~/lib/hero';

const modules = import.meta.glob<Record<string, unknown>>('./*.ts', { eager: true });

type H1 = { headline: string; subheadline?: string; face?: string };

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
  heroes(module, file.replace('./', '').replace('.ts', ''), []),
);

describe('hero copy', () => {
  it('finds the heroes', () => {
    expect(all.length).toBeGreaterThan(15);
  });

  it(`keeps each h1 at ${HERO_MAX_CHARS} characters or less`, () => {
    const over = all
      .map(([path, h1]) => [path, heroLength(h1)] as const)
      .filter(([, length]) => length > HERO_MAX_CHARS)
      .map(([path, length]) => `${path}: ${length}`);
    expect(over).toEqual([]);
  });
});
