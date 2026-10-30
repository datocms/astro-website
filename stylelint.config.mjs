// Stylelint rules for the CSS of the prototype.
// The rules keep the cascade layers honest (see "Cascade layers" in AGENTS.md).
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-strict-value'],
  ignoreFiles: ['node_modules/**', 'dist/**', '.astro/**', 'vendor/**'],
  rules: {
    // Rules of the standard config that only fight the style of the project.
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Use camelCase for a class name.' },
    ],
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'no-descending-specificity': null,
    // A rule is split in two places on purpose: a media query, a state, a comment.
    'no-duplicate-selectors': null,
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'import-notation': null,
    'alpha-value-notation': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'hue-degree-notation': null,
    'media-feature-range-notation': null,
    'shorthand-property-no-redundant-values': null,
    'value-keyword-case': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'selector-not-notation': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'length-zero-no-unit': null,
    'color-hex-length': null,
    'lightness-notation': null,
    'declaration-block-single-line-max-declarations': null,
    // The CSS modules use :global() and :local().
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    // A keyframe-like name in ::highlight() is a name, not a type selector.
    'selector-type-case': null,

    // The cascade: no tricks to win a rule.
    'selector-disallowed-list': [
      ['/\\.([\\w-]+)\\.\\1(?![\\w-])/'],
      { message: 'Do not repeat a class to win. Use the right layer or the API of the block.' },
    ],
    'selector-no-qualifying-type': [true, { ignore: ['attribute'] }],
    'selector-max-specificity': ['0,4,0', { severity: 'warning' }],
    'declaration-no-important': true,

    // Breakpoints. Container queries are not media queries, thus they are free.
    'media-feature-name-value-allowed-list': [
      {
        'min-width': ['/^(650|768|1152|1320)px$/'],
        'max-width': ['/^(649|767|1151|1319)px$/'],
      },
    ],

    // Colours come from the tokens.
    'scale-unlimited/declaration-strict-value': [
      [
        '/^color$/',
        '/^background-color$/',
        '/^border(-[a-z]+)?-color$/',
        '/^fill$/',
        '/^stroke$/',
        '/^outline-color$/',
      ],
      {
        ignoreValues: [
          'currentColor',
          'transparent',
          'inherit',
          'initial',
          'unset',
          'none',
          'revert',
        ],
        ignoreFunctions: true,
        disableFix: true,
        message: 'Use a colour token (var(--...)) for "${property}".',
      },
    ],
  },
  overrides: [
    {
      // The layers come from the plugin cssLayers. A module never writes @layer.
      // The marker on line 1 is a comment, thus it is allowed.
      files: ['src/**/*.module.css'],
      rules: {
        'at-rule-disallowed-list': [
          ['layer'],
          {
            message: 'Do not write @layer. The plugin cssLayers sets the layer (marker on line 1).',
          },
        ],
      },
    },
    {
      // The fake sites in the scenes may hard-code colours.
      files: ['src/scenes/**/site.module.css'],
      rules: { 'scale-unlimited/declaration-strict-value': null },
    },
    {
      // The tokens define the colours.
      files: ['src/styles/tokens.css'],
      rules: { 'scale-unlimited/declaration-strict-value': null },
    },
    {
      // Allowed here: the reset must win over everything.
      files: ['src/styles/global.css'],
      rules: { 'declaration-no-important': null },
    },
  ],
};
