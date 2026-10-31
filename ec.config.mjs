import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig, definePlugin } from 'astro-expressive-code';

/**
 * Give the role of a syntax colour: plain, punctuation, comment, keyword,
 * string, constant or function. The role comes from the hue and the lightness
 * of the colour of the dark theme. The docs map each role to a --code-* token
 * (src/layouts/docs/theme.css).
 */
function tokenRole(hex) {
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const lightness = (max + min) / 2;

  if (chroma < 0.2) {
    if (lightness > 0.78) return 'plain';
    return lightness > 0.62 ? 'punctuation' : 'comment';
  }

  let hue;
  if (max === r) hue = ((g - b) / chroma + 6) % 6;
  else if (max === g) hue = (b - r) / chroma + 2;
  else hue = (r - g) / chroma + 4;
  hue *= 60;

  if (hue >= 265 && hue < 330) return 'keyword';
  if (hue >= 175 && hue < 265) return 'function';
  if (hue >= 25 && hue < 110) return 'constant';
  return 'string';
}

/** Mark each coloured token with its role, in the attribute data-token. */
function tokenRoles(node) {
  if (node.type === 'element' && node.tagName === 'span') {
    const style = typeof node.properties?.style === 'string' ? node.properties.style : '';
    const dark = style.match(/--1:(#[0-9a-fA-F]{6})/);
    if (dark?.[1]) node.properties['data-token'] = tokenRole(dark[1]);
  }
  node.children?.forEach(tokenRoles);
}

const tokenRolesPlugin = definePlugin({
  name: 'token-roles',
  hooks: {
    postprocessRenderedLine: ({ renderData }) => tokenRoles(renderData.lineAst),
  },
});

export default defineEcConfig({
  themes: ['catppuccin-latte', 'catppuccin-frappe'],
  plugins: [pluginLineNumbers(), tokenRolesPlugin],
  styleOverrides: {
    codeFontSize: '1em',
    codeFontFamily: 'var(--font-mono)',
    codeLineHeight: '1.45',
    frames: {
      frameBoxShadowCssValue: '0',
    },
  },
});
