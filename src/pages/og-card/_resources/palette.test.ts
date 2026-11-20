/*
 * `palette.ts` mirrors the roles of tokens.css as opaque hex values. This
 * test computes each value from tokens.css, as the browser does, and
 * compares. When tokens.css changes, the test fails and prints the module
 * to paste into palette.ts.
 */
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { composite, toHex } from '~/lib/tokens/color';
import { pagePath, THEMES, TokenSheet } from '~/lib/tokens/resolve';
import { type OgPalette, palettes } from './palette';

const sheet = TokenSheet.fromFile(
  fileURLToPath(new URL('../../../styles/tokens.css', import.meta.url)),
);

function computePalette(theme: (typeof THEMES)[number]): OgPalette {
  const path = pagePath(theme, 'light');
  const color = (name: string) => sheet.color(path, name);
  const paper = color('--surface-default');
  const ink = color('--text-on-page');
  const accent = color('--surface-accent');
  const inverse = color('--surface-inverse');
  return {
    paper: toHex(paper),
    ink: toHex(ink),
    accent: toHex(accent),
    muted: toHex(composite(color('--text-on-page-muted'), paper)),
    headlineMuted: toHex(composite(color('--text-on-page-headline-muted'), paper)),
    chip: toHex(composite(color('--surface-inverse-faint'), paper)),
    onAccent: toHex(composite(color('--text-on-accent'), accent)),
    plate: toHex(color('--surface-raised')),
    border: toHex(composite(color('--border-on-page'), paper)),
    highlight: toHex(color('--theme-pixel-highlight')),
    accentMuted: toHex(composite(color('--text-on-accent-muted'), accent)),
    accentHeadlineMuted: toHex(composite(color('--text-on-accent-headline-muted'), accent)),
    accentBorder: toHex(composite(color('--border-on-accent-strong'), accent)),
    inverse: toHex(inverse),
    onInverseStrong: toHex(composite(color('--text-on-inverse-strong'), inverse)),
    onInverseMuted: toHex(composite(color('--text-on-inverse-muted'), inverse)),
    inverseBorder: toHex(composite(color('--border-on-inverse-strong'), inverse)),
  };
}

describe('the OG card palette', () => {
  it('matches tokens.css in each theme', () => {
    const computed = Object.fromEntries(THEMES.map((theme) => [theme, computePalette(theme)]));
    if (JSON.stringify(computed) !== JSON.stringify(palettes)) {
      console.log(`Paste into palette.ts:\n${JSON.stringify(computed, null, 2)}`);
    }
    expect(palettes).toEqual(computed);
  });
});
