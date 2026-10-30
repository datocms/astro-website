// The drawn emojis are small jewels: a glossy body in the accent of the
// theme, a deep rim, pixel glitter and sparks. They have the Tonal look of the
// pixel videos: the inverse surface, the accent, the pale highlight. The
// colours are tokens that do not change with the scheme (see the --jewel-*
// variables in style.module.css), thus a jewel is the same in light and dark.

export interface Drawing {
  viewBox: string;
  /** The SVG content. `id` is unique on the page, for the ids of the defs. */
  body: (id: string) => string;
}

const stop = (offset: number, colour: string) =>
  `<stop offset="${offset}" style="stop-color:${colour}"/>`;

/** The gradients of a jewel: the body and the gloss. */
const defs = (id: string) =>
  `<radialGradient id="${id}-jewel" cx=".34" cy=".28" r=".85">` +
  stop(0, 'var(--jewel-light)') +
  stop(0.32, 'var(--jewel-body)') +
  stop(0.78, 'var(--jewel-deep)') +
  stop(1, 'var(--jewel-rim)') +
  `</radialGradient>` +
  `<radialGradient id="${id}-gloss">` +
  `<stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>` +
  `</radialGradient>`;

/** A star with four points, centred on (x, y). */
function star(x: number, y: number, r: number): string {
  const k = r * 0.12;
  return (
    `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}` +
    `Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`
  );
}

/** Pixel cells that twinkle inside a jewel: x, y, size, delay (s). */
function glitter(cells: number[][]): string {
  return cells
    .map(
      ([x, y, s, delay]) =>
        `<rect data-cell x="${x}" y="${y}" width="${s}" height="${s}" style="animation-delay:-${delay}s"/>`,
    )
    .join('');
}

/** A spark out of the jewel, a small star. */
const spark = (n: number, x: number, y: number, r: number) =>
  `<path data-spark="${n}" d="${star(x, y, r)}"/>`;

const HEART =
  'M12 21.2c-.5 0-1-.2-1.4-.5C5.2 16.6 2 13.2 2 9.2 2 6 4.4 3.5 7.4 3.5c1.9 0 3.6 1 4.6 2.6 1-1.6 2.7-2.6 4.6-2.6 3 0 5.4 2.5 5.4 5.7 0 4-3.2 7.4-8.6 11.5-.4.3-.9.5-1.4.5Z';

const rim =
  'stroke="var(--jewel-rim)" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"';

export const drawings = {
  heart: {
    viewBox: '0 0 24 24',
    body: (id) =>
      `<defs>${defs(id)}<clipPath id="${id}-clip"><path d="${HEART}"/></clipPath></defs>` +
      `<path d="${HEART}" fill="url(#${id}-jewel)"/>` +
      `<g clip-path="url(#${id}-clip)"><g data-drift>` +
      glitter([
        [8, 9, 1.4, 0],
        [15.5, 8, 1.1, 0.7],
        [11, 12.5, 1, 1.4],
        [15, 14, 1.4, 0.3],
        [8.5, 14.5, 0.9, 2],
        [18.5, 10.5, 0.9, 1.1],
        [12.2, 17, 1.1, 2.4],
        [5, 10.5, 0.8, 1.8],
        [11, 6.5, 0.8, 2.8],
      ]) +
      `</g><ellipse cx="7.6" cy="7.4" rx="3.4" ry="2.1" fill="url(#${id}-gloss)" transform="rotate(-35 7.6 7.4)"/></g>` +
      spark(1, 22, 2.5, 2.2) +
      spark(2, 2, 19.5, 1.5),
  },
  // The cliché of the AI features: a cluster of stars in a purple-to-orange
  // gradient, with a shine that sweeps over it. The copy uses it with irony.
  // The gradient is a parody of a brand colour, thus it has hex values, as
  // the marks of the frameworks.
  sparkle: {
    viewBox: '0 0 24 24',
    body: (id) => {
      const stars = star(9.5, 14, 8.5) + star(19, 5, 4) + star(20, 18.5, 2.6);
      return (
        `<defs><linearGradient id="${id}-ai" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="#6b4dff"/><stop offset=".5" stop-color="#ff4fd8"/><stop offset="1" stop-color="#ffc247"/>` +
        `</linearGradient>` +
        `<linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0">` +
        `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>` +
        `</linearGradient>` +
        `<clipPath id="${id}-clip"><path d="${stars}"/></clipPath></defs>` +
        `<path data-star="1" d="${star(9.5, 14, 8.5)}" fill="url(#${id}-ai)"/>` +
        `<path data-star="2" d="${star(19, 5, 4)}" fill="url(#${id}-ai)"/>` +
        `<path data-star="3" d="${star(20, 18.5, 2.6)}" fill="url(#${id}-ai)"/>` +
        `<g clip-path="url(#${id}-clip)"><rect data-shine x="-8" y="-4" width="6" height="32" fill="url(#${id}-shine)" transform="rotate(20 12 12)"/></g>`
      );
    },
  },
} satisfies Record<string, Drawing>;

export type DrawingName = keyof typeof drawings;

/** The grawlix of the bleep: the glyphs take turns (see style.module.css). */
export const GRAWLIX_GLYPHS = 5;
