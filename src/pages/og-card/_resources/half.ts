import css from 'style-object-to-css-string';
import type { OgPicture } from '~/lib/ogCardUrl';
import type { Theme } from '~/lib/theme';
import type { OgPalette } from './palette';
import { dataUri } from './raster';
import { teamRowSize } from './team';
import { ADVANCE, chip, escape, units } from './text';

/*
 * The proof half of the card: the right half of the split, on the inverse
 * (DESIGN.md, "The split": the claim on the accent, its proof on the
 * inverse). The content comes from the page (`OgPicture`). A window has
 * the shape of a scene frame: a round corner at the top left, and the
 * edges of the card cut it at the right and at the bottom.
 *
 * The large text and the marks are on the inverse in
 * `--text-on-inverse-strong`, the labels in `--text-on-inverse-muted`.
 * The bottom of the content is at the bottom of the safe box of the card:
 * a feed that crops the card to 2:1 does not cut it.
 */
export interface HalfOptions {
  picture: OgPicture;
  palette: OgPalette;
  /** The theme of the card: it selects the file of a product window. */
  theme: Theme;
  width: number;
  height: number;
  /** The space above and below the content: the safe box of the card. */
  inset: { top: number; bottom: number; side: number };
  /** The file of the image of a window or a video. */
  image: Uint8Array | null;
}

const BAR = 40;
const RADIUS = 12;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * A label: the body text of ABC Oracle at the scale of the card. The card
 * has one typeface: the text of a label is never mono and never in capitals.
 */
export function label(size: number, color: string): Record<string, string | number> {
  return {
    display: 'flex',
    fontSize: `${size}px`,
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color,
  };
}

/** A large number: the title weight with the tracking of the display. */
function numeral(size: number): Record<string, string | number> {
  return {
    display: 'flex',
    fontSize: `${size}px`,
    fontWeight: 500,
    lineHeight: 0.85,
    letterSpacing: '-0.05em',
  };
}

/** The app window: a bar with three dots, then the image, cut by the edges of the card. */
function windowFrame(o: HalfOptions, image: string) {
  // The window is wider and taller than the half: the edges of the card cut it.
  const frameWidth = 640;
  const frameHeight = o.height;
  const dot = `<div style="${css({ display: 'flex', width: '14px', height: '14px', borderRadius: '9999px', background: o.palette.border })}"></div>`;
  return `<div style="${css({
    position: 'absolute',
    left: `${o.inset.side}px`,
    top: `${o.inset.top}px`,
    width: `${frameWidth}px`,
    height: `${frameHeight}px`,
    display: 'flex',
    flexDirection: 'column',
    background: o.palette.plate,
    borderTopLeftRadius: `${RADIUS}px`,
    overflow: 'hidden',
  })}">
    <div style="${css({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: `${BAR}px`,
      padding: '0 18px',
      borderBottom: `2px solid ${o.palette.border}`,
    })}">${dot}${dot}${dot}</div>
    <div style="${css({ display: 'flex', position: 'relative', width: `${frameWidth}px`, height: `${frameHeight - BAR}px` })}">
      <img src="${image}" style="${css({ width: `${frameWidth}px`, height: `${frameHeight - BAR}px`, objectFit: 'cover', objectPosition: 'left top' })}" />
    </div>
  </div>`;
}

/** The play button: a disc of the accent, with the triangle in the text of the accent. */
export function playButton(palette: OgPalette, size: number, position: Record<string, string>) {
  const play = `<svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="60" fill="${palette.accent}"/><path d="M48 38 L86 60 L48 82 Z" fill="${palette.onAccent}"/></svg>`;
  return `<img src="data:image/svg+xml;base64,${Buffer.from(play).toString('base64')}" style="${css({ width: `${size}px`, height: `${size}px`, ...position })}" />`;
}

/**
 * The screens of the product, one file for each scene and theme:
 * `<scene>-<theme>.jpg`, made by `scripts/og-scenes.mjs` from the page
 * `/dev/og-scenes`. The files are in the bundle: a Worker does not fetch
 * its own hostname.
 */
const SCENES = import.meta.glob<string>('./scenes/*.jpg', {
  query: '?inline',
  import: 'default',
  eager: true,
});
/** The size of a file of `scenes/`: a window of 1100 × 900 CSS px, at 1049px. The edges of the card cut a large part: the card shows less of the screen, at a larger size. */
const SCENE_SIZE = { width: 1049, height: 858 };

/** The window of the product, cut by the edges of the card at the right and at the bottom. */
function productWindow(o: HalfOptions, file: string) {
  return `<div style="${css({
    position: 'absolute',
    left: `${o.inset.side}px`,
    top: `${o.inset.top}px`,
    width: `${SCENE_SIZE.width}px`,
    height: `${SCENE_SIZE.height}px`,
    display: 'flex',
    borderTopLeftRadius: `${RADIUS}px`,
    overflow: 'hidden',
  })}"><img src="${file}" style="${css({ width: `${SCENE_SIZE.width}px`, height: `${SCENE_SIZE.height}px` })}" /></div>`;
}

/** The size of the day on the calendar page: larger than the visible sheet, so the edge of the card cuts it. */
const DAY_SIZE = 400;

/**
 * The date of an entry as a page of a wall calendar: a sheet of paper with
 * the month and the year on a band of the accent, then the day with two
 * digits. The sheet has the shape of a window: a round corner at the top
 * left, and the edges of the card cut it at the right and at the bottom.
 * The day is larger than the sheet: the edge of the card cuts its second
 * digit, as it cuts a window.
 */
function calendarPage(o: HalfOptions, date: Date): string {
  const { palette } = o;
  const day = String(date.getUTCDate()).padStart(2, '0');
  const pad = 36;
  return `<div style="${css({
    position: 'absolute',
    left: `${o.inset.side}px`,
    top: `${o.inset.top}px`,
    width: '640px',
    height: `${o.height}px`,
    display: 'flex',
    flexDirection: 'column',
    background: palette.plate,
    color: palette.ink,
    borderTopLeftRadius: `${RADIUS}px`,
    overflow: 'hidden',
  })}">
    <div style="${css({
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      height: '96px',
      padding: `0 ${pad}px`,
      background: palette.accent,
      color: palette.onAccent,
      fontSize: '40px',
      fontWeight: 500,
      letterSpacing: '-0.02em',
    })}">${MONTHS[date.getUTCMonth()]}<span style="${css({ color: palette.accentMuted, fontWeight: 400 })}">${date.getUTCFullYear()}</span></div>
    <div style="${css({ ...numeral(DAY_SIZE), marginTop: '48px', paddingLeft: `${pad - 12}px`, whiteSpace: 'nowrap' })}">${day}</div>
  </div>`;
}

/** The lines of a table of contents that the card shows. */
const CONTENTS_LINES = 5;

/**
 * The table of contents of a docs page: the headings of the page, numbered,
 * one on each line, with a hairline between the lines. A heading that is
 * too long ends with an ellipsis. With more headings than lines, the last
 * line says how many more headings the page has.
 */
function contents(o: HalfOptions, entries: string[]): string {
  const { palette } = o;
  const shown = entries.length > CONTENTS_LINES ? entries.slice(0, CONTENTS_LINES - 1) : entries;
  const more = entries.length - shown.length;
  const line = (index: string, text: string, color: string, first: boolean) =>
    `<div style="${css({
      display: 'flex',
      alignItems: 'baseline',
      gap: '24px',
      padding: '20px 0',
      borderTop: first ? 'none' : `2px solid ${palette.inverseBorder}`,
    })}">
      <div style="${css({ ...label(26, palette.onInverseMuted), width: '40px', flexShrink: 0 })}">${index}</div>
      <div style="${css({ ...label(30, color), fontWeight: 500, flexShrink: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' })}">${escape(text)}</div>
    </div>`;
  return [
    ...shown.map((entry, i) =>
      line(String(i + 1).padStart(2, '0'), entry, palette.onInverseStrong, i === 0),
    ),
    // The count of the other headings is in the column of the text, with no number.
    ...(more > 0 ? [line('', `+ ${more} more`, palette.onInverseMuted, false)] : []),
  ].join('');
}

/** The sizes of the names of a versus, the largest first. */
const VERSUS_SIZES = [104, 92, 80, 72, 64, 56, 48];

/**
 * A versus: DatoCMS and the other product, the same type at the same size,
 * one above the other, with a large "vs" between them. Neither name is a
 * logo: the two products are equals. The size is the largest step at which
 * the longest word fits the width of the half, and the lines of the three
 * parts fit its height.
 */
function versus(o: HalfOptions, other: string): string {
  const column = o.width - o.inset.side * 2;
  const height = o.height - o.inset.top - o.inset.bottom;
  const words = ['DatoCMS', ...other.split(/\s+/)];
  const longest = Math.max(...words.map(units));
  const lineCount = (size: number) => {
    const perLine = column / (size * ADVANCE);
    let lines = 1;
    let used = 0;
    for (const word of other.split(/\s+/)) {
      const add = (used > 0 ? units(' ') : 0) + units(word);
      if (used > 0 && used + add > perLine) {
        lines++;
        used = units(word);
      } else used += add;
    }
    return lines;
  };
  const size =
    VERSUS_SIZES.find(
      (step) => longest * step * ADVANCE <= column && (2 + lineCount(step)) * step * 1.05 <= height,
    ) ?? VERSUS_SIZES[VERSUS_SIZES.length - 1]!;
  const name = (text: string, color: string) =>
    `<div style="${css({
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: `${size}px`,
      lineHeight: 1,
      letterSpacing: '-0.04em',
      fontWeight: 500,
      color,
    })}">${escape(text)}</div>`;
  return `${name('DatoCMS', o.palette.onInverseStrong)}
    ${name('vs', o.palette.onInverseMuted)}
    ${name(other, o.palette.onInverseStrong)}`;
}

/** The markup of the half, for satori. */
export function half(o: HalfOptions): string {
  const { picture, palette, width, height, inset } = o;
  const ground = (body: string, extra: Record<string, string | number> = {}) =>
    `<div style="${css({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: `${width}px`,
      height: `${height}px`,
      display: 'flex',
      flexDirection: 'column',
      background: palette.inverse,
      color: palette.onInverseStrong,
      overflow: 'hidden',
      padding: `${inset.top}px ${inset.side}px ${inset.bottom}px`,
      ...extra,
    })}">${body}</div>`;
  const image = o.image ? dataUri(o.image) : null;

  switch (picture.kind) {
    case 'window':
      return ground(image ? windowFrame(o, image) : '');
    case 'video':
      // The play button and the length, at the size of a date.
      return ground(
        `${playButton(palette, 150, {})}
        ${picture.duration ? `<div style="${css({ ...numeral(150), marginTop: '48px' })}">${escape(picture.duration)}</div>` : ''}
        <div style="${css({ ...label(36, palette.onInverseMuted), marginTop: '32px' })}">Video</div>`,
        { justifyContent: 'flex-end' },
      );
    case 'product': {
      const file = SCENES[`./scenes/${picture.scene}-${o.theme}.jpg`];
      return ground(file ? productWindow(o, file) : '');
    }
    case 'cover': {
      // The cover of a plugin is 3:2. It is at the top of the half, as
      // wide as the half: the edges of the card hold it on three sides.
      const coverHeight = Math.round((width * 2) / 3);
      // The band below the cover: a number of the plugin (its installs),
      // else its author, at the centre of the band. The version is a chip
      // at the right of the band.
      const main = picture.stat
        ? `<div style="${css({ display: 'flex', flexDirection: 'column' })}">
            <div style="${css({ ...numeral(96) })}">${escape(picture.stat.value)}</div>
            <div style="${css({ ...label(36, palette.onInverseMuted), marginTop: '16px' })}">${escape(picture.stat.label)}</div>
          </div>`
        : picture.author
          ? `<div style="${css({ ...label(40, palette.onInverseStrong), fontWeight: 500, flexShrink: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' })}">${escape(picture.author)}</div>`
          : '<div style="display: flex"></div>';
      const above = `${main}${picture.version ? `<div style="${css({ display: 'flex', flexShrink: 0 })}">${chip(picture.version, palette.inverseBorder)}</div>` : ''}`;
      return ground(
        `${
          image
            ? `<img src="${image}" style="${css({ width: `${width}px`, height: `${coverHeight}px`, objectFit: 'cover' })}" />`
            : `<div style="${css({ display: 'flex', height: `${coverHeight}px` })}"></div>`
        }<div style="${css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          height: `${height - coverHeight}px`,
          padding: `0 ${inset.side}px`,
        })}">${above}</div>`,
        { padding: '0px' },
      );
    }
    case 'stat':
      return ground(
        `<div style="${css({ ...numeral(150) })}">${escape(picture.value)}</div>
        <div style="${css({ ...label(32, palette.onInverseMuted), marginTop: '24px' })}">${escape(picture.label)}</div>`,
        { justifyContent: 'flex-end' },
      );
    case 'date':
      return ground(calendarPage(o, new Date(picture.iso)));
    case 'pixel':
    case 'portraits':
      // The half is a PNG of its full size (`article.ts`).
      return ground(
        image
          ? `<img src="${image}" style="${css({ width: `${width}px`, height: `${height}px` })}" />`
          : '',
        { padding: '0px' },
      );
    case 'team': {
      const row = teamRowSize(picture.imageUrls.length);
      // The photos (a PNG of `team.ts`), then the names and the team, at
      // the bottom of the safe box. The ring of the first photo is outside
      // the side of the safe box.
      return ground(
        `${image ? `<img src="${image}" style="${css({ width: `${row.width}px`, height: `${row.height}px`, marginLeft: '-8px', alignSelf: 'flex-start' })}" />` : ''}
        <div style="${css({ ...label(40, palette.onInverseStrong), fontWeight: 500, marginTop: '40px' })}">${escape(picture.names)}</div>
        <div style="${css({ ...label(32, palette.onInverseMuted), marginTop: '8px' })}">${escape(picture.role)}</div>`,
        { justifyContent: 'flex-end' },
      );
    }
    case 'contents':
      return ground(contents(o, picture.entries), { justifyContent: 'flex-end' });
    case 'versus':
      return ground(versus(o, picture.other), { justifyContent: 'center' });
  }
}
