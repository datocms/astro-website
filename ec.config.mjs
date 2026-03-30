import { defineEcConfig } from 'astro-expressive-code';

/**
 * Prevents translation services (Google, Baidu, etc.) from breaking code blocks.
 * - Adds `translate="no"` and `class="notranslate"` to <code> elements
 */
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
  plugins: [pluginNoTranslate()],
  styleOverrides: {
    codeFontSize: '1em',
    codeFontFamily: 'var(--font-mono)',
    codeLineHeight: '1.45',
    frames: {
      frameBoxShadowCssValue: '0',
    },
  },
});
