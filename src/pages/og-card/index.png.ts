import type { APIRoute } from 'astro';
import { truncate } from 'lodash-es';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import css from 'style-object-to-css-string';
import wordmarkSvg from '~/assets/logo/wordmark.svg?raw';
import { ogCardHeight, ogCardWidth } from '~/lib/datocms/seo';
import type { OgCardData } from '~/lib/ogCardUrl';
import { toArrayBuffer } from '~/lib/toArrayBuffer';
import { handleUnexpectedError, invalidRequestResponse } from '~/pages/api/_utils';
import { type OgPalette, palettes } from './_resources/palette';
import { pixelPicture } from './_resources/pixelPicture';

/*
 * The OG card: the page of the site, at the scale of a social feed.
 *
 * The ground is the paper of the theme of the page. The top row holds the
 * wordmark and the kicker, as the header of the site holds the logo and the
 * path. The headline is in two tones: the title in the ink, then the
 * excerpt in the quiet run (DESIGN.md, "The Two-Tone Rule"). When the two
 * go over the length of a hero headline, the excerpt is the intro below the
 * title instead (DESIGN.md, "The Hero Length Rule"). The chips of the page
 * are at the bottom. The picture (`pixelPicture.ts`) is the right half of
 * a split, on the full height of the card.
 *
 * The sizes are the sizes of the site at 1320px, times 2: a card is seen at
 * approximately 500px of width in a feed.
 */
const PADDING = 60;
/** The picture: the right half of the split, on the full height. */
const PICTURE = { x: 736 };
const COLUMN = PICTURE.x - PADDING * 2;
const HEADLINE_MAX = 120;
const TITLE_MAX = 80;
const INTRO_SIZE = 28;
const INTRO_LEADING = 1.3;
const INTRO_GAP = 24;
/** The height for the headline and the intro: from under the top row to above the chips, with a gap. */
const BOX_HEIGHT = ogCardHeight - PADDING * 2 - 32 - 56 - 44 - 40;

/**
 * The number of lines of a text at a size, by the mean advance of a
 * character of ABC Oracle Medium with the tracking of the headline.
 */
function linesOf(text: string, size: number, advance: number): number {
  const perLine = Math.floor(COLUMN / (size * advance));
  return Math.ceil(text.length / perLine);
}

/**
 * The size of the headline and the length of the intro, thus both fit
 * above the chips. The headline starts at the size that its length gives,
 * and goes down one step while the two go over the box. The longest word
 * must fit the column: a word does not wrap. The intro keeps the lines
 * that are left, and at most three.
 */
function fit(headline: string, intro: string): { size: number; introLength: number } {
  const ladder = [96, 84, 72, 62, 54, 46];
  const length = headline.length;
  const first = length <= 30 ? 96 : length <= 50 ? 84 : length <= 80 ? 72 : length <= 110 ? 62 : 54;
  const longestWord = Math.max(...headline.split(/\s+/).map((word) => word.length));
  // 0.56em: the widest mean advance of a word, with a margin.
  const byWord = Math.floor(COLUMN / (longestWord * 0.56));
  const introLine = INTRO_SIZE * INTRO_LEADING;
  const introChars = Math.floor(COLUMN / (INTRO_SIZE * 0.47));

  let size = ladder[ladder.length - 1]!;
  let introLines = 0;
  for (const step of ladder) {
    if (step > first || step > byWord) continue;
    size = step;
    const headlineHeight = linesOf(headline, step, 0.55) * step + step * 0.12;
    const left = BOX_HEIGHT - headlineHeight - (intro ? INTRO_GAP : 0);
    introLines = intro ? Math.min(3, Math.floor(left / introLine)) : 0;
    if (left >= 0 && (!intro || introLines >= 1)) break;
  }
  return { size, introLength: introLines * introChars };
}

/**
 * A run of words. satori lays out one colour for each text node, thus the
 * headline is a wrapped row of words: each word is a box, and the two runs
 * of the headline keep their colours across the lines.
 */
function words(text: string, color: string, size: number): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) =>
        `<div style="${css({ display: 'flex', color, marginRight: `${size * 0.22}px` })}">${word}</div>`,
    )
    .join('');
}

/** The chips that fit in one row, then one chip with the count of the rest. */
function chipRow(pills: string[], size: number): string[] {
  const chipWidth = (text: string) => text.length * size * 0.52 + size * 1.5;
  const gap = 10;
  const shown: string[] = [];
  let used = 0;
  for (const [index, pill] of pills.entries()) {
    const rest = pills.length - index - 1;
    const tail = rest > 0 ? chipWidth(`+${rest}`) + gap : 0;
    if (used + chipWidth(pill) + tail > COLUMN) break;
    shown.push(pill);
    used += chipWidth(pill) + gap;
  }
  if (shown.length < pills.length) shown.push(`+${pills.length - shown.length}`);
  return shown;
}

/**
 * The text of the card, ready for the markup. ABC Oracle has no emoji and
 * satori has no fallback font, thus a pictograph goes out: it is decoration
 * in a title or an excerpt. The spaces collapse to one.
 */
function clean(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** A title ends with a stop, thus the quiet run reads as the aside. */
function sentence(title: string): string {
  return /[.!?:…]$/.test(title) ? title : `${title}.`;
}

function markup(data: OgCardData, palette: OgPalette) {
  const title = data.title ? truncate(clean(data.title), { length: TITLE_MAX, omission: '…' }) : '';
  const excerpt = data.excerpt ? clean(data.excerpt) : '';
  const kicker = data.kicker ? clean(data.kicker) : '';
  const pills = (data.pills ?? []).map(clean).filter(Boolean);

  // The excerpt is the quiet run of the headline when the two fit a hero
  // headline. Else it is the intro, in body text below the title.
  const headline = title ? sentence(title) : '';
  const inHeadline = Boolean(excerpt) && headline.length + 1 + excerpt.length <= HEADLINE_MAX;
  const { size, introLength } = fit(
    inHeadline ? `${headline} ${excerpt}` : headline,
    inHeadline ? '' : excerpt,
  );
  // A cut after a stop or a comma keeps only the ellipsis.
  const intro =
    excerpt && !inHeadline && introLength > 0
      ? truncate(excerpt, { length: introLength, separator: /\s/, omission: '…' }).replace(
          /[.,;:]…$/,
          '…',
        )
      : '';
  const chips = chipRow(pills, 22);

  const wordmark = wordmarkSvg
    .replace(/currentColor/g, palette.ink)
    .replace('<svg ', '<svg height="32" width="211" ');

  return html(/* HTML */ `
    <div
      style="${css({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: `${PADDING}px`,
        background: palette.paper,
        color: palette.ink,
        fontFamily: 'ABC Oracle',
      })}"
    >
      <div
        style="${css({
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          minHeight: '32px',
          width: `${COLUMN}px`,
        })}"
      >
        ${wordmark}
        ${
          kicker
            ? `<div
                style="${css({
                  display: 'flex',
                  fontSize: '22px',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  color: palette.muted,
                  marginTop: '2px',
                  flexShrink: 1,
                })}"
              >
                ${kicker}
              </div>`
            : ''
        }
      </div>
      <div
        style="${css({
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: `${COLUMN}px`,
          marginTop: '56px',
        })}"
      >
        ${
          headline
            ? `<div
                style="${css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  fontSize: `${size}px`,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  fontWeight: 500,
                  paddingBottom: `${size * 0.12}px`,
                })}"
              >
                ${words(headline, palette.ink, size)}
                ${inHeadline ? words(excerpt, palette.headlineMuted, size) : ''}
              </div>`
            : ''
        }
        ${
          intro
            ? `<div
                style="${css({
                  display: 'flex',
                  fontSize: `${INTRO_SIZE}px`,
                  lineHeight: INTRO_LEADING,
                  letterSpacing: '-0.01em',
                  color: palette.muted,
                  marginTop: `${INTRO_GAP}px`,
                })}"
              >
                ${intro}
              </div>`
            : ''
        }
      </div>
      ${
        chips.length > 0
          ? `<div style="${css({ display: 'flex', gap: '10px', width: `${COLUMN}px` })}">
              ${chips
                .map(
                  (text) => `<div
                    style="${css({
                      display: 'flex',
                      alignItems: 'center',
                      height: '44px',
                      padding: '0 16px',
                      borderRadius: '9999px',
                      background: palette.chip,
                      color: palette.ink,
                      fontSize: '22px',
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    })}"
                  >
                    ${text}
                  </div>`,
                )
                .join('')}
            </div>`
          : ''
      }
    </div>
  `);
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // satori reads static TTF and OTF files only, thus the card uses the two
    // static instances of ABC Oracle in the font bucket, not the variable font.
    const loadFont = (file: string) =>
      fetch(new URL(`/fonts/${file}`, url)).then((res) => {
        if (!res.ok) {
          throw new Error(`Could not load ${file} for the OG card: HTTP ${res.status}`);
        }
        return res.arrayBuffer();
      });

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

    // A logo that does not load gives the symbol: the card never fails for it.
    const loadLogo = async (): Promise<Buffer | null> => {
      if (!data.logoPngUrl) return null;
      try {
        const res = await fetch(data.logoPngUrl);
        return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
      } catch {
        return null;
      }
    };

    const [oracleRegular, oracleMedium, logo] = await Promise.all([
      loadFont('ABCOracle-Regular.otf'),
      loadFont('ABCOracle-Medium.otf'),
      loadLogo(),
    ]);

    const [svg, picture] = await Promise.all([
      satori(markup(data, palette) as any, {
        width: ogCardWidth,
        height: ogCardHeight,
        fonts: [
          { name: 'ABC Oracle', data: oracleRegular, style: 'normal', weight: 400 },
          { name: 'ABC Oracle', data: oracleMedium, style: 'normal', weight: 500 },
        ],
      }),
      pixelPicture({
        width: ogCardWidth - PICTURE.x,
        height: ogCardHeight,
        palette,
        logo,
      }),
    ]);

    const png = await sharp(Buffer.from(svg))
      .composite([{ input: picture, left: PICTURE.x, top: 0 }])
      .png()
      .toBuffer();

    return new Response(toArrayBuffer(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
