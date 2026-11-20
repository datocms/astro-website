import type { APIRoute } from 'astro';
import { satori } from '@cf-wasm/satori';
import { html } from 'satori-html';
import css from 'style-object-to-css-string';
import { ogCardHeight, ogCardWidth } from '~/lib/datocms/seo';
import type { OgCardData, OgPicture } from '~/lib/ogCardUrl';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError, invalidRequestResponse } from '~/pages/api/_utils';
import { UI_FONTS_BASE_URL } from 'astro:env/server';
import { pixelProof, portraitsHalf } from './_resources/article';
import { teamRow } from './_resources/team';
import { half, label, playButton } from './_resources/half';
import { type OgPalette, palettes } from './_resources/palette';
import { picture } from './_resources/picture';
import { dataUri, jpegSize, pngSize, svgToPng } from './_resources/raster';
import {
  ADVANCE,
  CHIP as CHIP_SIZE,
  chip,
  escape,
  symbol,
  units,
  wordmark,
} from './_resources/text';

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
const WORDMARK_HEIGHT = 42;
const SYMBOL_HEIGHT = 52;
const KICKER_SIZE = 36;
/** The height of the bottom row: the line of the kicker. */
const BOTTOM_ROW = 52;
const BOTTOM_GAP = 40;
const CHIP = { ...CHIP_SIZE, max: 2 };
const STAT = { size: 96, label: 30, gap: 16 };
/** The steps of the title, by the width of its column. */
const LADDER = { split: [104, 92, 80, 72, 64], full: [150, 132, 116, 104, 92, 80] };
/** The smallest size of a title with a quiet run: below it, the title is alone. */
const MIN_QUIET = { split: 64, full: 92 };

type Word = { text: string; quiet: boolean };

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
  let fallback: { size: number; lines: Word[][]; whole: true } | undefined;
  for (const size of ladder) {
    const perLine = Math.floor(column / (size * ADVANCE));
    if (longest > perLine) continue;
    const lines = balance(words, perLine);
    if (lines.length * size > height) continue;
    // A short word alone on a line ("of", "API") breaks the reading of a
    // title of three words or more: the next step can put it with a
    // neighbour. If no step can, the largest step that fits is the result.
    const lonely =
      words.length > 2 && lines.some((line) => line.length === 1 && line[0]!.text.length < 4);
    if (!lonely) return { size, lines, whole: true as const };
    fallback ??= { size, lines, whole: true as const };
  }
  if (fallback) return fallback;
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
    // An excerpt that starts in lower case continues the sentence of the
    // title ("Projects from" + "our partners."), as the muted run of a hero:
    // then the title gets no full stop.
    const lead = /^\p{Ll}/u.test(excerpt) ? title : sentence(title);
    for (const quiet of quietRuns(excerpt)) {
      const result = fit(
        [...wordsOf(lead, false), ...wordsOf(quiet, true)],
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

/** The box of the logo of a technology: its height, and its largest width. */
const TECH_LOGO = { height: 56, maxWidth: 280 };

/**
 * The logo of a technology in one colour, the colour of the title, as a
 * mask on the site (`LogoItem`): each paint of the SVG takes the colour,
 * and a white paint goes.
 * The result is an <img> at the height of `TECH_LOGO`, or undefined for a
 * file with no size.
 */
function techLogo(svg: string, color: string): string | undefined {
  const root = svg.match(/<svg\b[^>]*>/)?.[0];
  if (!root) return undefined;
  const viewBox = root
    .match(/viewBox="([^"]+)"/)?.[1]
    ?.split(/[\s,]+/)
    .map(Number);
  const width = viewBox?.[2] ?? Number.parseFloat(root.match(/\swidth="([\d.]+)/)?.[1] ?? '');
  const height = viewBox?.[3] ?? Number.parseFloat(root.match(/\sheight="([\d.]+)/)?.[1] ?? '');
  if (!width || !height) return undefined;
  // A white paint is a cut in the mark (the S of Svelte): it stays empty.
  const paint = (value: string) =>
    value === 'none' || /^(#fff(fff)?|white)$/i.test(value) ? 'none' : color;
  const body = svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/(fill|stroke)="([^"]*)"/g, (_, attribute, value) => `${attribute}="${paint(value)}"`)
    .replace(
      /(fill|stroke):\s*([^;"]+)/g,
      (_, property, value) => `${property}:${paint(value.trim())}`,
    )
    // The paths with no fill take the fill of the root.
    .replace(/<svg\b([^>]*)>/, (_, attributes: string) => {
      const rest = attributes.replace(/\sfill="[^"]*"/, '');
      return `<svg${rest} fill="${color}"${viewBox ? '' : ` viewBox="0 0 ${width} ${height}"`}>`;
    });
  const scale = Math.min(TECH_LOGO.height / height, TECH_LOGO.maxWidth / width);
  return `<img src="data:image/svg+xml;base64,${Buffer.from(body).toString('base64')}" style="${css(
    {
      width: `${Math.round(width * scale)}px`,
      height: `${Math.round(height * scale)}px`,
    },
  )}" />`;
}

interface Layout {
  /** The width of the claim: the left half, or the full card. */
  width: number;
  /** The wordmark goes from the bottom row when the proof shows it. */
  withWordmark: boolean;
  /** A number of the page under the title, when the logo has the proof half. */
  stat?: Extract<OgPicture, { kind: 'stat' }>;
  /** The logo of a technology (`techLogoUrl`), as an <img>: it takes the place of the chips. */
  techLogo?: string;
}

function markup(data: OgCardData, palette: OgPalette, layout: Layout, proof = '') {
  const full = layout.width === ogCardWidth;
  const column = layout.width - SAFE.side * 2;
  const title = data.title ? clean(data.title) : '';
  const excerpt = data.excerpt ? clean(data.excerpt) : '';
  const kicker = data.kicker ? kickerOf(clean(data.kicker)) : '';
  const chips =
    layout.stat || layout.techLogo
      ? []
      : (data.pills ?? []).map(clean).filter(Boolean).slice(0, CHIP.max);

  const below = layout.stat
    ? STAT.size + STAT.gap + Math.round(STAT.label * 1.3) + BOTTOM_GAP
    : layout.techLogo
      ? TECH_LOGO.height + BOTTOM_GAP
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
            layout.techLogo
              ? `<div style="${css({ display: 'flex', marginBottom: `${BOTTOM_GAP}px` })}">${layout.techLogo}</div>`
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

/**
 * The card of a plugin with a cover, and of a video with a frame: the
 * picture on the split, as large as the box at the right permits, with a
 * margin to the edges of the card. The box is 3:2, as a cover: a picture of
 * a different shape is smaller, at the right of the box, and the card
 * never cuts it.
 */
const COVER = {
  margin: 40,
  box: { width: 825, height: 550 },
  radius: 16,
  side: 48,
  // The largest size of the symbol and the kicker at the top of the column.
  mark: 60,
  play: 128,
};

/**
 * The size of the symbol and the kicker: the largest that fits the width
 * of the column, up to `COVER.mark`. The symbol is square, and 16 px apart.
 */
function markSize(kicker: string, column: number): number {
  const fit = (column - 16) / (1 + units(kicker) * ADVANCE * 1.1);
  return Math.min(COVER.mark, Math.floor(fit));
}

/**
 * A card with the picture on the split: the accent at the left, the
 * inverse at the right, and the seam at the middle of the picture. The
 * column at the left has the symbol with the kicker at the top, and
 * `bottom` at the bottom. `overlay` is on the picture.
 */
function framedMarkup(
  data: OgCardData,
  palette: OgPalette,
  image: Uint8Array,
  parts: {
    bottom: (column: number) => string;
    overlay?: (width: number, height: number) => string;
  },
) {
  const file = jpegSize(image);
  const scale = Math.min(COVER.box.width / file.width, COVER.box.height / file.height);
  const width = Math.round(file.width * scale);
  const height = Math.round(file.height * scale);
  const strip = ogCardWidth - COVER.margin - COVER.box.width;
  const seam = Math.round(ogCardWidth - COVER.margin - width / 2);
  const column = strip - COVER.side - COVER.margin;
  const kicker = data.kicker ? kickerOf(clean(data.kicker)) : '';
  const mark = markSize(kicker, column);
  return decode(
    html(/* HTML */ `
      <div
        style="${css({
          display: 'flex',
          width: '100%',
          height: '100%',
          background: palette.accent,
          color: palette.onAccent,
          fontFamily: 'ABC Oracle',
          position: 'relative',
        })}"
      >
        <div
          style="${css({
            display: 'flex',
            position: 'absolute',
            left: `${seam}px`,
            top: '0px',
            width: `${ogCardWidth - seam}px`,
            height: `${ogCardHeight}px`,
            background: palette.inverse,
          })}"
        ></div>
        <div
          style="${css({
            display: 'flex',
            flexDirection: 'column',
            width: `${strip}px`,
            height: '100%',
            padding: `${SAFE.top}px ${COVER.margin}px ${SAFE.bottom}px ${COVER.side}px`,
          })}"
        >
          <div style="${css({ display: 'flex', flexGrow: 1, alignItems: 'flex-start' })}">
            <div style="${css({ display: 'flex', alignItems: 'center', gap: '16px' })}">
              ${symbol(palette.onAccent, mark)}
              ${kicker ? `<div style="${css({ ...label(mark, palette.onAccent), fontWeight: 500, lineHeight: 1, letterSpacing: '-0.04em', whiteSpace: 'nowrap' })}">${escape(kicker)}</div>` : ''}
            </div>
          </div>
          ${parts.bottom(column)}
        </div>
        <div
          style="${css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: `${COVER.box.width}px`,
            height: '100%',
          })}"
        >
          <div
            style="${css({ display: 'flex', position: 'relative', width: `${width}px`, height: `${height}px` })}"
          >
            <img
              src="${dataUri(image)}"
              style="${css({ width: `${width}px`, height: `${height}px`, borderRadius: `${COVER.radius}px` })}"
            />
            ${parts.overlay?.(width, height) ?? ''}
          </div>
        </div>
      </div>
    `),
  );
}

/**
 * The card of a plugin with a cover. The cover shows the name of the
 * plugin, thus the card does not repeat the title. At the bottom of the
 * column: `Official` (else the version), and the installs (else the author).
 */
function coverMarkup(
  data: OgCardData,
  picture: Extract<OgPicture, { kind: 'cover' }>,
  palette: OgPalette,
  image: Uint8Array,
) {
  const chips = (data.pills ?? []).map(clean).filter(Boolean).slice(0, 1);
  // The chips: `Official`, else the version. An official plugin has no
  // version on the card: one chip is enough.
  const facts = chips.length > 0 ? chips : picture.version ? [clean(picture.version)] : [];
  return framedMarkup(data, palette, image, {
    bottom: (column) => {
      const fact = picture.stat
        ? `<div style="${css({ display: 'flex', fontSize: '80px', lineHeight: 1, letterSpacing: '-0.05em', fontWeight: 500 })}">${escape(picture.stat.value)}</div>
          <div style="${css({ ...label(30, palette.accentMuted), marginTop: '12px' })}">${escape(picture.stat.label)}</div>`
        : picture.author
          ? `<div style="${css({ ...label(30, palette.onAccent), fontWeight: 500, width: `${column}px`, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' })}">${escape(clean(picture.author))}</div>`
          : '';
      return `${
        facts.length > 0
          ? `<div style="${css({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginBottom: '32px' })}">
            ${facts.map((text) => chip(text, palette.accentBorder)).join('')}
          </div>`
          : ''
      }<div style="${css({ display: 'flex', flexDirection: 'column' })}">${fact}</div>`;
    },
  });
}

/**
 * The card of a video with a frame. The frame has the play button at its
 * centre and the length as a chip at its bottom left, as a player. At the
 * bottom of the column: the title, then the series.
 */
function videoMarkup(
  data: OgCardData,
  picture: Extract<OgPicture, { kind: 'video' }>,
  palette: OgPalette,
  image: Uint8Array,
) {
  const title = data.title ? clean(data.title) : '';
  return framedMarkup(data, palette, image, {
    bottom: (column) => {
      // The title takes the largest step whose lines fit the column, in
      // three lines at most.
      const { size, lines } = fit(wordsOf(title, false), column, 44 * 3, [44, 40, 36, 32]);
      return `<div style="${css({ display: 'flex', flexDirection: 'column', width: `${column}px`, fontSize: `${size}px`, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 500 })}">${lines
        .map(
          (line) =>
            `<div style="${css({ display: 'flex' })}">${escape(line.map((word) => word.text).join(' '))}</div>`,
        )
        .join('')}</div>
      ${picture.series ? `<div style="${css({ ...label(28, palette.accentMuted), lineHeight: 1.2, marginTop: '16px', width: `${column}px` })}">${escape(clean(picture.series))}</div>` : ''}`;
    },
    overlay: (width, height) =>
      `${playButton(palette, COVER.play, { position: 'absolute', left: `${(width - COVER.play) / 2}px`, top: `${(height - COVER.play) / 2}px` })}
      ${
        picture.duration
          ? `<div style="${css({
              display: 'flex',
              position: 'absolute',
              // At the left: the presenter is at the bottom right of the frame.
              left: '20px',
              bottom: '20px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: palette.inverse,
              color: palette.onInverseStrong,
              fontSize: '30px',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            })}">${escape(picture.duration)}</div>`
          : ''
      }`,
  });
}

/** A card stays in the caches for one year. */
const ONE_YEAR = 60 * 60 * 24 * 365;

export const GET: APIRoute = async ({ request, url, cache }) => {
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

    // The logo of a technology (an SVG). A logo that does not load gives
    // the chips: the card never fails for it.
    const loadTechLogo = async (): Promise<string | undefined> => {
      if (!data.techLogoUrl) return undefined;
      try {
        const res = await fetch(data.techLogoUrl);
        return res.ok ? techLogo(await res.text(), palette.onAccent) : undefined;
      } catch {
        return undefined;
      }
    };

    // The portraits of the guests of a chat, or the photos of a team. A
    // photo that does not load gives the card with no proof: the card never
    // fails for it.
    const loadPortraits = async (): Promise<Uint8Array[] | null> => {
      const picture = data.picture;
      if (picture?.kind !== 'portraits' && picture?.kind !== 'team') return null;
      if (picture.imageUrls.length === 0) return null;
      try {
        return await Promise.all(
          picture.imageUrls.slice(0, 3).map(async (imageUrl) => {
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return new Uint8Array(await res.arrayBuffer());
          }),
        );
      } catch {
        return null;
      }
    };

    const [oracleRegular, oracleMedium, logo, loaded, tech, portraits] = await Promise.all([
      loadFont('ABCOracle-Regular.otf'),
      loadFont('ABCOracle-Medium.otf'),
      loadLogo(),
      loadImage(),
      loadTechLogo(),
      loadPortraits(),
    ]);

    const fonts = [
      { name: 'ABC Oracle', data: oracleRegular, style: 'normal' as const, weight: 400 as const },
      { name: 'ABC Oracle', data: oracleMedium, style: 'normal' as const, weight: 500 as const },
    ];
    const render = (markup: unknown) =>
      satori(markup as any, { width: ogCardWidth, height: ogCardHeight, fonts });
    const proofKind = data.picture?.kind;
    // A cover, a product window, the window of a showcase project and a table
    // of contents have half of the card: they are the subject of the page.
    let splitX =
      proofKind === 'cover' ||
      proofKind === 'product' ||
      proofKind === 'contents' ||
      proofKind === 'portraits' ||
      proofKind === 'team' ||
      (data.picture?.kind === 'window' && data.picture.half)
        ? ogCardWidth / 2
        : SPLIT_X;
    // The proof of an article is a PNG that the card draws from the files.
    // The subject of a pixel cover gives the left edge of its proof.
    let image = loaded;
    if (data.picture?.kind === 'pixel') {
      const proof = loaded
        ? await pixelProof(loaded, palette, { width: ogCardWidth, height: ogCardHeight }).catch(
            () => null,
          )
        : null;
      image = proof?.png ?? null;
      if (proof) splitX = proof.left;
    }
    const halfSize = { width: ogCardWidth - splitX, height: ogCardHeight };
    if (data.picture?.kind === 'portraits') {
      image = portraits ? await portraitsHalf(portraits, palette, halfSize) : null;
    }
    if (data.picture?.kind === 'team') {
      image = portraits ? await teamRow(portraits, palette) : null;
    }
    // A proof that needs a file that does not load gives the card with no proof.
    const needsImage = (picture: NonNullable<OgCardData['picture']>) =>
      ('imageUrl' in picture && Boolean(picture.imageUrl)) ||
      picture.kind === 'portraits' ||
      picture.kind === 'team';

    let svg: string;
    // A cover of a plugin and a frame of a video go on the split. A file
    // that is not a JPEG gives the card with the half.
    const framed = (() => {
      if (!image) return null;
      try {
        if (data.picture?.kind === 'cover') return coverMarkup(data, data.picture, palette, image);
        if (data.picture?.kind === 'video') return videoMarkup(data, data.picture, palette, image);
      } catch {}
      return null;
    })();
    if (framed) {
      svg = await render(framed);
    } else if (logo) {
      // The logo has the proof half. A number of the page goes under the title.
      const stat = data.picture?.kind === 'stat' ? data.picture : undefined;
      const [card, logoHalf] = await Promise.all([
        render(markup(data, palette, { width: SPLIT_X, withWordmark: true, stat, techLogo: tech })),
        picture({ ...halfSize, palette, logo }),
      ]);
      // The half goes inline in the SVG of the card (see `picture.ts`).
      svg = card.replace(
        /<\/svg>\s*$/,
        `${logoHalf.replace('<svg ', `<svg x="${SPLIT_X}" y="0" `)}</svg>`,
      );
    } else if (data.picture && (!needsImage(data.picture) || image)) {
      const proof = `<div style="${css({
        position: 'absolute',
        left: `${splitX}px`,
        top: '0px',
        width: `${halfSize.width}px`,
        height: `${halfSize.height}px`,
        display: 'flex',
      })}">${half({ theme: data.theme ?? 'purple', picture: data.picture, palette, image, inset: SAFE, ...halfSize })}</div>`;
      svg = await render(
        markup(data, palette, { width: splitX, withWordmark: true, techLogo: tech }, proof),
      );
    } else {
      // No proof, or an image that does not load: the title has the full width.
      svg = await render(
        markup(data, palette, { width: ogCardWidth, withWordmark: true, techLogo: tech }),
      );
    }

    const png = await svgToPng(svg);
    // The URL holds all the data of the card: the same URL always gives the
    // same card, and a change to the record gives a new URL. Thus the card
    // stays in the cache of the Worker with no tags, and no purge removes
    // it. A deploy starts the cache of the Worker again (the version tag),
    // and `OG_CARD_VERSION` of `~/lib/ogCardUrl` gives a new URL to the
    // caches outside the Worker. An error is not in the cache.
    cache.set({ maxAge: ONE_YEAR });
    return new Response(toArrayBuffer(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        // In local dev, the browser does not keep the card: a change to the
        // design shows at the next load, with no new version.
        'Cache-Control': import.meta.env.DEV
          ? 'no-store'
          : `public, max-age=${ONE_YEAR}, immutable`,
      },
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
