type Attrs = Record<string, string>;

/**
 * Remove the `[style align="right" width="20%"]` shortcode from the name
 * of a column, and give its attributes. The editors use it to align the
 * cells of a column and to set its width.
 */
export function parseColumn(raw: string) {
  let style: Attrs | undefined;
  const content = raw.replace(/\[style([^\]]*)\]/g, (_match, attrs: string) => {
    style = {};
    for (const [, key, a, b, c] of attrs.matchAll(/(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g)) {
      style[key!] = a ?? b ?? c ?? '';
    }
    return '';
  });
  return { id: raw, content: content.trim(), style };
}

export function toCss(style: Attrs | undefined) {
  return {
    ...(style?.align ? { textAlign: style.align } : {}),
    ...(style?.width ? { width: style.width } : {}),
  };
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape the HTML of a cell, change the text in backticks to `<code>`
 * and the line breaks to `<br>`.
 */
export function cellToHtml(input: string | undefined) {
  if (!input) return '';
  return input
    .replace(/[&<>"']/g, (char) => htmlEscapes[char]!)
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
    .replace(/\r?\n|\r/g, '<br>');
}
