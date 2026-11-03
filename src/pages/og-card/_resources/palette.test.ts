/*
 * `palette.ts` mirrors the roles of tokens.css as opaque hex values. This
 * test computes each value from tokens.css, as the browser does, and
 * compares. When tokens.css changes, the test fails and prints the module
 * to paste into palette.ts.
 */
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { colorMix, composite, toHex } from '~/lib/tokens/color';
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
  return {
    paper: toHex(paper),
    ink: toHex(ink),
    accent: toHex(accent),
    muted: toHex(composite(color('--text-on-page-muted'), paper)),
    headlineMuted: toHex(composite(color('--text-on-page-headline-muted'), paper)),
    chip: toHex(composite(color('--surface-inverse-faint'), paper)),
    frameLine: toHex(colorMix('oklab', accent, 65, ink, 35)),
    inkOnAccentMuted: toHex(composite(color('--text-on-accent-muted'), accent)),
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
