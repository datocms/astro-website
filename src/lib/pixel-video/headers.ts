// The headers of the .pxv files of public/videos, for the server (see the
// plugin `pxvHeaders` in astro.config.ts). Do not import this module in a
// client script: it contains the header of each file.

import headers from 'virtual:pxv-headers';
import type { PixelFrames } from './format';
import { resolveSettings, type PixelVideoSettings } from './settings';
import { findPalette, type Palette } from './styles';

export type PxvHeader = Omit<PixelFrames, 'cells'>;

/** The URLs of all the files, for example `/videos/hand-ok.pxv`. */
export const pxvFiles: string[] = Object.keys(headers);

/** The header of a file of public/videos. Throws when there is no file. */
export function pxvHeader(src: string): PxvHeader {
  const header = headers[src];
  if (!header) throw new Error(`[pixel-video] no file ${src} in public/videos`);
  return header;
}

/** The settings of a file, merged on the defaults, and its palette. */
export function pxvLook(src: string): { settings: PixelVideoSettings; palette: Palette } {
  const settings = resolveSettings(pxvHeader(src).settings);
  return { settings, palette: findPalette(settings.palette)! };
}

/**
 * The data of a file for the tag of `DevConfig` (development only): the
 * file, the palette, the focus, the lens, the cells, the frames, the edges
 * and the source. `palette` is the palette that the element gives, if any.
 */
export function pxvDevConfig(
  src: string,
  { palette, lens = true }: { palette?: string; lens?: boolean } = {},
): Record<string, unknown> {
  const header = pxvHeader(src);
  return {
    src,
    palette: palette ?? `${pxvLook(src).palette.name} (file)`,
    focus: header.settings?.focus,
    lens,
    cells: `${header.width} × ${header.height}`,
    frames: `${header.count} at ${header.fps} fps (${(header.count / header.fps).toFixed(1)} s)`,
    edges: header.edges?.length ? header.edges.join(', ') : undefined,
    source: header.source,
  };
}
