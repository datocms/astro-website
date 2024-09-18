import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['catppuccin-latte'],
  plugins: [pluginLineNumbers()],
  styleOverrides: {
    codeFontSize: '1em',
    codeFontFamily: 'var(--font-mono)',
    codeLineHeight: '1.45',
    frames: {
      frameBoxShadowCssValue: '0',
    },
  },
});
