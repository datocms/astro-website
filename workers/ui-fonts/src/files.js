// The keys of the bucket that the Worker serves. A file in the bucket that
// is not here stays private. `upload.mjs` uploads only these keys.

// The subsets of `@fontsource-variable/geist-mono`. The `@font-face` rules
// of `datocms-react-ui` use these names and the unicode ranges of this
// version. Change the version and the rules together.
export const GEIST_MONO = {
  package: '@fontsource-variable/geist-mono',
  version: '5.3.0',
  subsets: ['cyrillic-ext', 'cyrillic', 'symbols2', 'vietnamese', 'latin-ext', 'latin'],
};

export const geistMonoKey = (subset) => `GeistMonoVariable-${subset}.woff2`;

export const FILES = new Set(['ABCOracleVariable.woff2', ...GEIST_MONO.subsets.map(geistMonoKey)]);
