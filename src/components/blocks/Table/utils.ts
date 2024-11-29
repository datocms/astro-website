import { replace } from '@wordpress/shortcode';

type MetaValue = Record<string, string | undefined>;

export function parseShortCodes(text: string, codes: string[]) {
  const meta: Record<string, MetaValue> = {};

  const newText = codes.reduce(
    (result, code) =>
      replace(code, result, (match) => {
        meta[code] = match.attrs.named || {};
        return '';
      }),
    text,
  );

  return { id: text, content: newText, meta };
}

export function toCss(style: MetaValue | undefined): astroHTML.JSX.CSSProperties {
  if (!style) {
    return {};
  }

  return {
    ...(style.align ? { textAlign: style.align } : {}),
    ...(style.width ? { width: style.width } : {}),
  };
}
