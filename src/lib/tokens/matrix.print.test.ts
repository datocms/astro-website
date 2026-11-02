/*
 * Writes the contrast matrix of tokens.css: the worst pairing of each text
 * role on each surface, across the themes and the schemes.
 *   TOKENS_MATRIX=/path/to/matrix.txt npx vitest run src/lib/tokens/matrix.print.test.ts
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { it } from 'vitest';
import { audit, matrix } from './audit';
import { TokenSheet } from './resolve';

it.skipIf(!process.env.TOKENS_MATRIX)('writes the matrix', () => {
  const sheet = TokenSheet.fromFile(
    fileURLToPath(new URL('../../styles/tokens.css', import.meta.url)),
  );
  const result = audit(sheet);
  const lines = [...matrix(result.pairings)]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([key, p]) =>
        `${p.ratio.toFixed(2).padStart(5)} (min ${p.minimum}) ${key}  [${p.scheme}/${p.theme} ${p.textHex} on ${p.surfaceHex}]`,
    );
  writeFileSync(
    process.env.TOKENS_MATRIX!,
    `pairings ${result.pairings.length}, mismatches ${result.mismatches.length}\n${lines.join('\n')}\n`,
  );
});
