// @ts-check
// Lint only the CSS of the redesign with stylelint.config.mjs.
// The old CSS does not obey these rules, thus the script does not lint it.
// The scope comes from redesign-css-scope.mjs (the same scope as the
// cssLayers plugin in astro.config.ts).
// Usage: npm run lint:css [-- --fix]
import stylelint from 'stylelint';
import { legacyCssIgnoreGlobs, redesignCssGlobs } from '../redesign-css-scope.mjs';

const fix = process.argv.includes('--fix');

const result = await stylelint.lint({
  files: redesignCssGlobs(),
  ignorePattern: legacyCssIgnoreGlobs(),
  allowEmptyInput: true,
  fix,
  formatter: 'string',
});

if (result.report) process.stdout.write(result.report);

const files = result.results.length;
const warnings = result.results.reduce((sum, file) => sum + file.warnings.length, 0);
console.log(`stylelint: ${files} files, ${warnings} problems.`);

if (result.errored) process.exitCode = 1;
