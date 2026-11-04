/*
 * The pixel ornaments of the API cards: one 8×8 square for each card. They
 * do not show what the API does. They are one family: the faint tone is
 * the ground of the square, the tone rises to the middle, and a 2×2 block
 * of the darkest tone is the heart. Each has a different texture: a halo,
 * a lattice, a dither, a spark.
 *
 * Tones: 0 ground, 1 light, 2 accent, 3 heart.
 *
 * A cell has a tone at rest (`a`) and a tone on the current card (`c`).
 * At rest the tone 3 cells show tone 2: only the current card has a dark
 * heart. On hover, a ripple goes out from the heart again and again: the
 * cells of a ring show tone `b` for one beat, then tone `c`. `t` is the
 * start of the ripple of the cell, in ms. With reduced motion, no ripple.
 */

export const SIZE = 8;

export type Tone = 0 | 1 | 2 | 3;

export type Cell = {
  a: Tone;
  c?: Tone;
  b?: Tone;
  t?: number;
};

export type GlyphKind = 'cda' | 'cma' | 'asset' | 'realtime';

const PATTERNS: Record<GlyphKind, string[]> = {
  /* A halo. */
  cda: [
    '00000000',
    '00111100',
    '01222210',
    '01233210',
    '01233210',
    '01222210',
    '00111100',
    '00000000',
  ],
  /* A lattice of 2×2 tiles. */
  cma: [
    '11022011',
    '11022011',
    '00000000',
    '22033022',
    '22033022',
    '00000000',
    '11022011',
    '11022011',
  ],
  /* A checker of single cells, as a dithered image. */
  asset: [
    '10101010',
    '01010101',
    '10202010',
    '01033201',
    '10233010',
    '01020201',
    '10101010',
    '01010101',
  ],
  /* A spark. */
  realtime: [
    '10000001',
    '12000021',
    '02200220',
    '00233200',
    '00233200',
    '02200220',
    '12000021',
    '10000001',
  ],
};

/*
 * One beat is two steps of the pixel field. The CSS holds the same value:
 * the period of the ripple (6 beats) and the length of a flash (1 beat).
 */
const BEAT = 250;

/* The distance of a cell from the 2×2 middle: 0 for the heart, 3 for the edge. */
function ring(r: number, c: number): number {
  const d = (x: number) => (x < SIZE / 2 ? SIZE / 2 - 1 - x : x - SIZE / 2);
  return Math.max(d(r), d(c));
}

/* The ripple starts after two beats, and goes out one ring each beat. */
export function glyphCells(kind: GlyphKind): Cell[] {
  return PATTERNS[kind].flatMap((row, r) =>
    [...row].map((ch, c): Cell => {
      const tone = Number(ch) as Tone;
      const rest: Tone = tone === 3 ? 2 : tone;
      if (tone === 0) return { a: 0 };
      const k = ring(r, c);
      if (k === 0) return { a: rest, c: tone };
      return { a: rest, c: tone, b: 3, t: 2 * BEAT + (k - 1) * BEAT };
    }),
  );
}
