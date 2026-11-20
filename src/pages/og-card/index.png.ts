import type { APIRoute } from 'astro';
import { satori } from '@cf-wasm/satori';
import { html } from 'satori-html';
import css from 'style-object-to-css-string';
import { ogCardHeight, ogCardWidth } from '~/lib/datocms/seo';
import type { OgCardData, OgPicture } from '~/lib/ogCardUrl';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError, invalidRequestResponse } from '~/pages/api/_utils';
import { UI_FONTS_BASE_URL } from 'astro:env/server';
import { half, label } from './_resources/half';
import { type OgPalette, palettes } from './_resources/palette';
import { picture } from './_resources/picture';
import { pngSize, svgToPng } from './_resources/raster';
import { CHIP as CHIP_SIZE, chip, escape, symbol, wordmark } from './_resources/text';

/*
 * The OG card: a split of the site at the scale of a social feed
 * (DESIGN.md, "The split"). The claim is on the accent at the left: the
 * title, and at the bottom the wordmark with the kind of the page. The
 * proof is at the right: on the inverse (`half.ts`), or the logo of a
 * customer or a partner on a white half (`picture.ts`). A page with no
 * proof gives the title the full width of the accent.
 *
 * A card is seen at approximately 500px of width, thus the smallest text
 * is 24px (10px in the feed) and the title is 64px or more. The text stays
 * inside the safe box: X crops the card to 2:1, 15px at the top and at the
 * bottom.
 */
const SAFE = { top: 72, bottom: 72, side: 64 };
/** The left edge of the proof half. */
const SPLIT_X = 720;
/** The wordmark alone, and the symbol next to the kicker. */
const WORDMARK_HEIGHT = 46;
const SYMBOL_HEIGHT = 52;
const KICKER_SIZE = 36;
/** The height of the bottom row: the line of the kicker. */
const BOTTOM_ROW = 52;
const BOTTOM_GAP = 40;
const CHIP = { ...CHIP_SIZE, max: 2 };
const STAT = { size: 96, label: 30, gap: 16 };
/** The steps of the title, by the width of its column. */
const LADDER = { split: [104, 92, 80, 72, 64], full: [150, 132, 116, 104, 92, 80] };
/** The mean advance of a character of ABC Oracle Medium with the tracking of the title, in em. */
const ADVANCE = 0.5;
/** The smallest size of a title with a quiet run: below it, the title is alone. */
const MIN_QUIET = { split: 64, full: 92 };

type Word = { text: string; quiet: boolean };

/**
 * The width of a text in mean characters (`ADVANCE`). A capital and a digit
 * are wider than the mean, a space and a mark are narrower: a title in
 * capitals ("JSON") takes more space than its count of characters.
 */
function units(text: string): number {
  let em = 0;
  for (const char of text) {
    if (/[A-Z]/.test(char)) em += char === 'I' ? 0.3 : char === 'M' || char === 'W' ? 0.82 : 0.66;
    else if (/[0-9]/.test(char)) em += 0.56;
    else if (/[a-z]/.test(char))
      em += char === 'i' || char === 'l' ? 0.24 : char === 'm' || char === 'w' ? 0.76 : 0.5;
    else if (/[\s.,:;'’!|]/.test(char)) em += 0.26;
    else em += 0.55;
  }
  return em / ADVANCE;
}

/** The lines of the words at a width in mean characters, the first line that is full first. */
const SPACE = units(' ');

function wrap(words: Word[], perLine: number): Word[][] {
  const lines: Word[][] = [];
  let line: Word[] = [];
  let used = 0;
  for (const word of words) {
    const add = (used > 0 ? SPACE : 0) + units(word.text);
    if (used > 0 && used + add > perLine) {
      lines.push(line);
      line = [];
      used = 0;
    }
    line.push(word);
    used += add;
  }
  if (line.length > 0) lines.push(line);
  return lines;
}

/**
 * The lines of the title, balanced: the narrowest width that gives the same
 * number of lines. A balanced title has no single word on its last line.
 */
function balance(words: Word[], perLine: number): Word[][] {
  const count = wrap(words, perLine).length;
  let narrow = perLine;
  while (narrow > 1 && wrap(words, narrow - 1).length === count) narrow--;
  return wrap(words, narrow);
}

/**
 * The size and the lines of the title. The title takes the largest step
 * whose lines fit the height. At the smallest step, the lines that do not
 * fit go, and the last line ends with an ellipsis.
 */
function fit(words: Word[], column: number, height: number, ladder: number[]) {
  const longest = Math.max(...words.map((word) => units(word.text)));
  for (const size of ladder) {
    const perLine = Math.floor(column / (size * ADVANCE));
    if (longest > perLine) continue;
    const lines = balance(words, perLine);
    if (lines.length * size <= height) return { size, lines, whole: true };
  }
  const size = ladder[ladder.length - 1]!;
  const perLine = Math.floor(column / (size * ADVANCE));
  const lines = wrap(words, perLine).slice(0, Math.max(1, Math.floor(height / size)));
  const last = lines[lines.length - 1]!;
  last[last.length - 1] = { ...last[last.length - 1]!, text: `${last[last.length - 1]!.text}…` };
  return { size, lines, whole: false };
}

/**
 * The text of the card. ABC Oracle has only the Latin script, with no emoji,
 * and satori has no fallback font: a character of a different script or a
 * pictograph goes out, else it shows as an empty box. The spaces collapse to one.
 */
function clean(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/[^\s\u0020-\u024F\u0300-\u036F\u1E00-\u1EFF\u2000-\u22FF]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

type Node = { props?: { children?: unknown } };

/** satori-html does not decode the entities: this gives the characters of `escape` back. */
function decode<T>(node: T): T {
  const children = (node as Node).props?.children;
  if (typeof children === 'string') {
    (node as Node).props!.children = children
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  } else if (Array.isArray(children)) {
    children.forEach(decode);
  } else if (children && typeof children === 'object') {
    decode(children);
  }
  return node;
}

/**
 * The kicker next to the wordmark. A kicker that starts with the name says
 * it two times ("DatoCMS DatoCMS Agency Partner"), thus the name goes.
 */
function kickerOf(text: string): string {
  return text.replace(/^DatoCMS\s+/i, '');
}

/** A text ends with a stop: the quiet run reads as the aside of a claim. */
function sentence(text: string): string {
  return /[.!?…:]$/.test(text) ? text : `${text}.`;
}

function wordsOf(text: string, quiet: boolean): Word[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({ text, quiet }));
}

/**
 * The quiet runs that the excerpt can give, the longest first: its first
 * sentence, then the first clause of that sentence ("Server Components
 * fetch it, Draft Mode previews it" gives "Server Components fetch it.").
 */
function quietRuns(excerpt: string): string[] {
  const first = excerpt.split(/(?<=[.!?])\s/)[0]!;
  const clause = first.split(/,\s|\s[—–-]\s|:\s|;\s/)[0]!;
  return [...new Set([first, clause])].filter(Boolean).map(sentence);
}

/**
 * The title in two tones (DESIGN.md, "The Two-Tone Rule"): the title, then
 * the excerpt as the quiet run. The card takes the longest quiet run that
 * fits whole at the smallest size of a quiet run. When none fits, the
 * title is alone.
 */
function headline(
  title: string,
  excerpt: string,
  {
    column,
    height,
    ladder,
    minQuiet,
  }: { column: number; height: number; ladder: number[]; minQuiet: number },
) {
  if (title && excerpt) {
    for (const quiet of quietRuns(excerpt)) {
      const result = fit(
        [...wordsOf(sentence(title), false), ...wordsOf(quiet, true)],
        column,
        height,
        ladder,
      );
      if (result.whole && result.size >= minQuiet) return result;
    }
  }
  const words = wordsOf(title, false);
  return words.length ? fit(words, column, height, ladder) : { size: 0, lines: [], whole: true };
}

interface Layout {
  /** The width of the claim: the left half, or the full card. */
  width: number;
  /** The wordmark goes from the bottom row when the proof shows it. */
  withWordmark: boolean;
  /** A number of the page under the title, when the logo has the proof half. */
  stat?: Extract<OgPicture, { kind: 'stat' }>;
}

function markup(data: OgCardData, palette: OgPalette, layout: Layout, proof = '') {
  const full = layout.width === ogCardWidth;
  const column = layout.width - SAFE.side * 2;
  const title = data.title ? clean(data.title) : '';
  const excerpt = data.excerpt ? clean(data.excerpt) : '';
  const kicker = data.kicker ? kickerOf(clean(data.kicker)) : '';
  const chips = layout.stat ? [] : (data.pills ?? []).map(clean).filter(Boolean).slice(0, CHIP.max);

  const below = layout.stat
    ? STAT.size + STAT.gap + Math.round(STAT.label * 1.3) + BOTTOM_GAP
    : chips.length > 0
      ? CHIP.height + BOTTOM_GAP
      : 0;
  const titleHeight = ogCardHeight - SAFE.top - SAFE.bottom - BOTTOM_ROW - BOTTOM_GAP - below;
  const { size, lines } = headline(title, excerpt, {
    column,
    height: titleHeight,
    ladder: full ? LADDER.full : LADDER.split,
    minQuiet: full ? MIN_QUIET.full : MIN_QUIET.split,
  });

  const line = (words: Word[]) =>
    `<div style="${css({ display: 'flex', flexWrap: 'wrap' })}">${words
      .map(
        (word, index) =>
          `<div style="${css({
            display: 'flex',
            color: word.quiet ? palette.accentHeadlineMuted : palette.onAccent,
            // A word never shrinks: a narrow line wraps, it does not squeeze its words.
            flexShrink: 0,
            marginLeft: index > 0 ? `${size * 0.22}px` : '0px',
          })}">${escape(word.text)}</div>`,
      )
      .join('')}</div>`;

  return decode(
    html(/* HTML */ `
      <div
        style="${css({
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          background: palette.accent,
          color: palette.onAccent,
          fontFamily: 'ABC Oracle',
        })}"
      >
        <div
          style="${css({
            display: 'flex',
            flexDirection: 'column',
            width: `${layout.width}px`,
            height: '100%',
            padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom}px`,
          })}"
        >
          <div
            style="${css({
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              fontSize: `${size}px`,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 500,
            })}"
          >
            ${lines.map(line).join('')}
          </div>
          ${
            layout.stat
              ? `<div style="${css({ display: 'flex', flexDirection: 'column', marginBottom: `${BOTTOM_GAP}px` })}">
                <div style="${css({ display: 'flex', fontSize: `${STAT.size}px`, lineHeight: 1, letterSpacing: '-0.05em', fontWeight: 500 })}">${escape(layout.stat.value)}</div>
                <div style="${css({ ...label(STAT.label, palette.accentMuted), marginTop: `${STAT.gap}px` })}">${escape(layout.stat.label)}</div>
              </div>`
              : ''
          }
          ${
            chips.length > 0
              ? `<div style="${css({ display: 'flex', gap: '12px', marginBottom: `${BOTTOM_GAP}px` })}">
                ${chips.map((text) => chip(text, palette.accentBorder)).join('')}
              </div>`
              : ''
          }
          <div
            style="${css({
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              height: `${BOTTOM_ROW}px`,
              width: `${column}px`,
            })}"
          >
            ${
              // Next to a kicker the symbol is the mark: the kicker is the text of
              // the row. A page that asks for it (`wordmark`) keeps the wordmark.
              layout.withWordmark
                ? kicker && !data.wordmark
                  ? symbol(palette.onAccent, SYMBOL_HEIGHT)
                  : wordmark(palette.onAccent, { height: WORDMARK_HEIGHT })
                : ''
            }
            ${
              kicker
                ? `<div style="${css({
                    ...label(KICKER_SIZE, palette.accentMuted),
                    flexShrink: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  })}">${escape(kicker)}</div>`
                : ''
            }
          </div>
        </div>
        ${proof}
      </div>
    `),
  );
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // satori reads static TTF and OTF files only, thus the card uses the two
    // static instances of ABC Oracle in the font bucket, not the variable font.
    // The files come from the bucket, not from `/fonts/` of the site: a
    // Worker that fetches its own hostname does not reach itself. The bucket
    // is a Worker on workers.dev, and a Worker reaches it only through the
    // service binding `UI_FONTS`. In local dev the binding can be absent or
    // fail, thus the URL is the fallback.
    const loadFont = async (file: string) => {
      const fontUrl = `${UI_FONTS_BASE_URL}/${file}`;
      const { env } = await import('cloudflare:workers');
      let res = await env.UI_FONTS?.fetch(fontUrl).catch(() => undefined);
      if (!res?.ok) res = await fetch(fontUrl);
      if (!res.ok) {
        throw new Error(`Could not load ${file} for the OG card: HTTP ${res.status}`);
      }
      return res.arrayBuffer();
    };

    const rawData = url.searchParams.get('data');

    if (!rawData) {
      return invalidRequestResponse('Missing data URL param', 404);
    }

    let data: OgCardData;
    try {
      data = JSON.parse(Buffer.from(rawData, 'base64').toString('utf-8'));
    } catch (e) {
      return invalidRequestResponse('Invalid data URL param', 404);
    }

    const palette = palettes[data.theme ?? 'purple'] ?? palettes.purple;

    // A logo that does not load, or that is not a PNG, gives the card with
    // no logo: the card never fails for it.
    const loadLogo = async (): Promise<Uint8Array | null> => {
      if (!data.logoPngUrl) return null;
      try {
        const res = await fetch(data.logoPngUrl);
        if (!res.ok) return null;
        const file = new Uint8Array(await res.arrayBuffer());
        // A file that is not a PNG gives an error here.
        pngSize(file);
        return file;
      } catch {
        return null;
      }
    };

    // The image of a window or a video. An image that does not load gives
    // the card with no proof: the card never fails for it.
    const loadImage = async (): Promise<Uint8Array | null> => {
      const picture = data.picture;
      if (!picture || !('imageUrl' in picture) || !picture.imageUrl) return null;
      try {
        const res = await fetch(picture.imageUrl);
        return res.ok ? new Uint8Array(await res.arrayBuffer()) : null;
      } catch {
        return null;
      }
    };

    const [oracleRegular, oracleMedium, logo, image] = await Promise.all([
      loadFont('ABCOracle-Regular.otf'),
      loadFont('ABCOracle-Medium.otf'),
      loadLogo(),
      loadImage(),
    ]);

    const fonts = [
      { name: 'ABC Oracle', data: oracleRegular, style: 'normal' as const, weight: 400 as const },
      { name: 'ABC Oracle', data: oracleMedium, style: 'normal' as const, weight: 500 as const },
    ];
    const render = (markup: unknown) =>
      satori(markup as any, { width: ogCardWidth, height: ogCardHeight, fonts });
    const proofKind = data.picture?.kind;
    // A cover and a product window have half of the card: they are pictures, not details.
    const splitX = proofKind === 'cover' || proofKind === 'product' ? ogCardWidth / 2 : SPLIT_X;
    const halfSize = { width: ogCardWidth - splitX, height: ogCardHeight };

    let svg: string;
    if (logo) {
      // The logo has the proof half. A number of the page goes under the title.
      const stat = data.picture?.kind === 'stat' ? data.picture : undefined;
      const [card, logoHalf] = await Promise.all([
        render(markup(data, palette, { width: SPLIT_X, withWordmark: true, stat })),
        picture({ ...halfSize, palette, logo }),
      ]);
      // The half goes inline in the SVG of the card (see `picture.ts`).
      svg = card.replace(
        /<\/svg>\s*$/,
        `${logoHalf.replace('<svg ', `<svg x="${SPLIT_X}" y="0" `)}</svg>`,
      );
    } else if (data.picture && (!('imageUrl' in data.picture) || !data.picture.imageUrl || image)) {
      const proof = `<div style="${css({
        position: 'absolute',
        left: `${splitX}px`,
        top: '0px',
        width: `${halfSize.width}px`,
        height: `${halfSize.height}px`,
        display: 'flex',
      })}">${half({ theme: data.theme ?? 'purple', picture: data.picture, palette, image, inset: SAFE, ...halfSize })}</div>`;
      // The versus half shows the wordmark: the bottom row does not repeat it.
      svg = await render(
        markup(data, palette, { width: splitX, withWordmark: proofKind !== 'versus' }, proof),
      );
    } else {
      // No proof, or an image that does not load: the title has the full width.
      svg = await render(markup(data, palette, { width: ogCardWidth, withWordmark: true }));
    }

    const png = await svgToPng(svg);
    return new Response(toArrayBuffer(png), {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
