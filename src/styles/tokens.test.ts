/*
 * The colour tokens meet WCAG 2.2 AA by construction. The test reads
 * tokens.css, computes each colour as the browser does, and checks every
 * text role on every surface of its ground, in the six themes and the two
 * schemes (the rules are in tokens.css and in src/lib/tokens/contract.ts).
 */
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { audit, matrix } from '~/lib/tokens/audit';
import { TokenSheet } from '~/lib/tokens/resolve';

const sheet = TokenSheet.fromFile(fileURLToPath(new URL('./tokens.css', import.meta.url)));
const result = audit(sheet);

const describePairing = (p: {
  theme: string;
  scheme: string;
  context: string;
  text: string;
  surface: string;
  ratio: number;
  minimum: number;
  textHex: string;
  surfaceHex: string;
}) =>
  `${p.scheme}/${p.theme} ${p.context}: ${p.text} (${p.textHex}) on ${p.surface} (${p.surfaceHex}) = ${p.ratio.toFixed(2)}, needs ${p.minimum}`;

describe('tokens.css', () => {
  it('audits every ground in every theme and scheme', () => {
    // 2 schemes x 6 themes x 3 grounds, at least.
    expect(result.pairings.length).toBeGreaterThan(1000);
  });

  it('gives every text role its contrast on every surface of its ground', () => {
    const failures = result.pairings.filter((p) => p.ratio < p.minimum).map(describePairing);
    expect(failures).toEqual([]);
  });

  it('maps the contextual roles to the canonical roles inside each ground class', () => {
    const failures = result.mismatches.map(
      (m) =>
        `${m.scheme}/${m.theme} .${m.context}: ${m.contextual} is ${m.contextualHex}, ${m.canonical} is ${m.canonicalHex}`,
    );
    expect(failures).toEqual([]);
  });

  it('keeps a margin above the minimum for the worst pairing of each role', () => {
    // A primitive that moves by one step must not break a role: 0.1 of margin.
    const thin = [...matrix(result.pairings).values()]
      .filter((p) => p.ratio < p.minimum + 0.1)
      .map(describePairing);
    expect(thin).toEqual([]);
  });
});
