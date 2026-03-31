import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

/** Adds `translate="no"` and `class="notranslate"` to <code> elements
 *  to prevent Google & Translate from breaking code block layout */
function pluginNoTranslate() {
  return {
    name: 'no-translate',
    hooks: {
      postprocessRenderedBlock: ({ renderData }) => {
        addNoTranslate(renderData.blockAst);
      },
    },
  };
}

function addNoTranslate(node) {
  if (node.type === 'element' && node.tagName === 'code') {
    node.properties.translate = 'no';
    node.properties.className = [...(node.properties.className || []), 'notranslate'];
  }
  node.children?.forEach(addNoTranslate);
}

export default defineEcConfig({
  themes: ['catppuccin-latte', 'catppuccin-frappe'],
  plugins: [pluginLineNumbers(), pluginNoTranslate()],
  styleOverrides: {
    codeFontSize: '1em',
    codeFontFamily: 'var(--font-mono)',
    codeLineHeight: '1.45',
    frames: {
      frameBoxShadowCssValue: '0',
    },
  },
});
