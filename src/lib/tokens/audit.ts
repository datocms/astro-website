/*
 * The audit of the colour tokens: every text role on every surface of its
 * ground, in every theme and scheme, with its contrast ratio and the
 * minimum that the contract asks. The test asserts on it; a script prints
 * it as a matrix.
 */
import {
  CANONICAL_ROLES,
  CODE_ROLES,
  CONTEXTUAL_ROLES,
  DERIVED_TEXT_ROLES,
  GROUND_CLASS,
  GROUND_SURFACE,
  INVERSE_SURFACES,
  AA_LARGE_TEXT,
  AA_TEXT,
  BUTTON_PAIRS,
  PAGE_STRONG_TINTS,
  PAGE_TINTS,
  PAGE_TINTS_WITHOUT_MUTED,
  STATUS_PAIRS,
  type Ground,
} from './contract';
import { composite, contrast, toHex, type Rgba } from './color';
import {
  pagePath,
  SCHEMES,
  THEMES,
  type PathElement,
  type Scheme,
  type Theme,
  TokenSheet,
} from './resolve';

export interface Pairing {
  theme: Theme;
  scheme: Scheme;
  /** Where the text sits: the ground, or a box inside it. */
  context: string;
  text: string;
  surface: string;
  ratio: number;
  minimum: number;
  textHex: string;
  surfaceHex: string;
}

export interface Mismatch {
  theme: Theme;
  scheme: Scheme;
  context: string;
  contextual: string;
  canonical: string;
  contextualHex: string;
  canonicalHex: string;
}

export interface Audit {
  pairings: Pairing[];
  mismatches: Mismatch[];
}

const GROUNDS: Ground[] = ['page', 'accent', 'inverse'];

/** The tints of the accent. */
const ACCENT_TINTS = [
  '--surface-accent-faint',
  '--surface-accent-subtle',
  '--surface-accent-muted',
];

/** The opaque colour of a surface: a tint is an alpha over the page. */
function opaque(sheet: TokenSheet, path: PathElement[], surface: string, under: Rgba): Rgba {
  return composite(sheet.color(path, surface), under);
}

export function audit(sheet: TokenSheet): Audit {
  const pairings: Pairing[] = [];
  const mismatches: Mismatch[] = [];

  const pair = (
    theme: Theme,
    scheme: Scheme,
    context: string,
    path: PathElement[],
    text: string,
    surface: string,
    surfaceColor: Rgba,
    minimum: number,
  ) => {
    const textColor = composite(sheet.color(path, text), surfaceColor);
    pairings.push({
      theme,
      scheme,
      context,
      text,
      surface,
      ratio: contrast(textColor, surfaceColor),
      minimum,
      textHex: toHex(textColor),
      surfaceHex: toHex(surfaceColor),
    });
  };

  for (const scheme of SCHEMES) {
    for (const theme of THEMES) {
      const page = pagePath(theme, scheme);
      const pageColor = sheet.color(page, '--surface-default');

      for (const ground of GROUNDS) {
        const box = pagePath(theme, scheme, [GROUND_CLASS[ground]]);
        // The main surface is the one the box paints: opaque, over the page.
        // It resolves on the box: the dark scheme changes the accent there.
        const main = opaque(sheet, box, GROUND_SURFACE[ground], pageColor);
        const context = GROUND_CLASS[ground];

        // The canonical roles of the ground, on its main surface.
        for (const [role, minimum] of Object.entries(CANONICAL_ROLES[ground])) {
          pair(theme, scheme, context, box, role, GROUND_SURFACE[ground], main, minimum);
        }

        // The contextual roles inside the ground class are the canonical roles.
        for (const [contextual, byGround] of Object.entries(CONTEXTUAL_ROLES)) {
          const a = sheet.color(box, contextual);
          const b = sheet.color(box, byGround[ground]);
          if (toHex(a) !== toHex(b)) {
            mismatches.push({
              theme,
              scheme,
              context,
              contextual,
              canonical: byGround[ground],
              contextualHex: toHex(a),
              canonicalHex: toHex(b),
            });
          }
        }

        // The derived text roles, on the main surface.
        for (const role of DERIVED_TEXT_ROLES) {
          pair(theme, scheme, context, box, role, GROUND_SURFACE[ground], main, AA_TEXT);
        }

        // The button in each state: its fill over the main surface, its text on the fill.
        for (const [surface, text] of BUTTON_PAIRS) {
          const fill = opaque(sheet, box, surface, main);
          pair(theme, scheme, context, box, text, surface, fill, AA_TEXT);
        }

        // The other surfaces of the inverse ground: the same roles.
        if (ground === 'inverse') {
          for (const surface of INVERSE_SURFACES) {
            const surfaceColor = opaque(sheet, box, surface, pageColor);
            for (const [role, minimum] of Object.entries(CANONICAL_ROLES.inverse)) {
              pair(theme, scheme, context, box, role, surface, surfaceColor, minimum);
            }
            for (const role of DERIVED_TEXT_ROLES) {
              pair(theme, scheme, context, box, role, surface, surfaceColor, AA_TEXT);
            }
          }
        }

        // The page family inside the ground: the page and the accent grounds
        // carry cards and tints.
        if (ground !== 'inverse') {
          const base = ground === 'page' ? main : opaque(sheet, box, '--surface-default', main);
          const family = ['--surface-default', ...PAGE_TINTS];
          for (const surface of family) {
            const surfaceColor =
              surface === '--surface-default' ? base : opaque(sheet, box, surface, base);
            for (const role of ['--text-primary', '--text-soft', '--text-muted']) {
              if (
                role === '--text-muted' &&
                (PAGE_TINTS_WITHOUT_MUTED as readonly string[]).includes(surface)
              ) {
                continue;
              }
              pair(theme, scheme, context, box, role, surface, surfaceColor, AA_TEXT);
            }
            // A two-tone headline on a tinted section: large text.
            pair(
              theme,
              scheme,
              context,
              box,
              '--text-headline-muted',
              surface,
              surfaceColor,
              AA_LARGE_TEXT,
            );
            for (const role of DERIVED_TEXT_ROLES) {
              pair(theme, scheme, context, box, role, surface, surfaceColor, AA_TEXT);
            }
          }
          for (const surface of PAGE_STRONG_TINTS) {
            const surfaceColor = opaque(sheet, box, surface, base);
            pair(theme, scheme, context, box, '--text-primary', surface, surfaceColor, AA_TEXT);
          }
          for (const [surface, text] of STATUS_PAIRS) {
            const surfaceColor = opaque(sheet, box, surface, base);
            pair(theme, scheme, context, box, text, surface, surfaceColor, AA_TEXT);
          }
          // On the accent ground the accent tints also sit directly on the accent.
          if (ground === 'accent') {
            for (const surface of ACCENT_TINTS) {
              const surfaceColor = opaque(sheet, box, surface, main);
              for (const role of ['--text-primary', '--text-soft', '--text-muted']) {
                pair(
                  theme,
                  scheme,
                  `${context} on accent`,
                  box,
                  role,
                  surface,
                  surfaceColor,
                  AA_TEXT,
                );
              }
            }
          }
          // The ink pill: the page surface as text on the primary text as fill.
          const ink = sheet.color(box, '--text-primary');
          pair(
            theme,
            scheme,
            context,
            box,
            '--surface-default',
            '--text-primary',
            composite(ink, base),
            AA_TEXT,
          );
        }
      }

      // A theme switch inside a ground keeps the text of the ground.
      for (const ground of ['accent', 'inverse'] as Ground[]) {
        const outer = pagePath(theme, scheme, [GROUND_CLASS[ground]]);
        const main = opaque(sheet, outer, GROUND_SURFACE[ground], pageColor);
        for (const inner of THEMES) {
          if (inner === theme) continue;
          const nested = [...outer, { theme: inner }];
          const context = `${GROUND_CLASS[ground]} > [data-theme=${inner}]`;
          for (const role of ['--text-primary', '--text-soft', '--text-muted']) {
            pair(theme, scheme, context, nested, role, GROUND_SURFACE[ground], main, AA_TEXT);
          }
        }
      }

      // A page window inside the inverse ground.
      const window = pagePath(theme, scheme, ['surfaceInverse'], ['surfacePage']);
      const windowColor = sheet.color(window, '--surface-default');
      for (const role of ['--text-primary', '--text-soft', '--text-muted']) {
        pair(
          theme,
          scheme,
          'surfaceInverse > surfacePage',
          window,
          role,
          '--surface-default',
          windowColor,
          AA_TEXT,
        );
      }

      // The code card.
      const code = sheet.color(page, '--code-background');
      for (const [role, minimum] of Object.entries(CODE_ROLES)) {
        pair(theme, scheme, 'code', page, role, '--code-background', code, minimum);
      }
    }
  }

  return { pairings, mismatches };
}

/** The lowest ratio of each text role on each surface, across the themes and schemes. */
export function matrix(pairings: Pairing[]): Map<string, Pairing> {
  const worst = new Map<string, Pairing>();
  for (const p of pairings) {
    const key = `${p.context} | ${p.text} on ${p.surface}`;
    const current = worst.get(key);
    if (!current || p.ratio < current.ratio) worst.set(key, p);
  }
  return worst;
}
