/*
 * The color scheme of the site: light or dark. The scheme is the
 * attribute data-color-scheme on <html> (src/styles/tokens.css). The product
 * scenes follow data-product-scenes-scheme on <html> (the README of
 * @datocms/product-scenes). The inline script of
 * src/components/SchemeScript sets both before the first paint, with the
 * same constants and the same rule as here: the choice of the visitor,
 * else light. The site does not follow the scheme of the system: the brand
 * is light, and dark is a choice of the visitor (DESIGN.md, "Dark scheme").
 */

export type ColorScheme = 'light' | 'dark';

export const STORAGE_KEY = 'color-scheme';

export function currentColorScheme(): ColorScheme {
  return document.documentElement.dataset.colorScheme === 'dark' ? 'dark' : 'light';
}

function applyColorScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  root.dataset.colorScheme = scheme;
  root.dataset.productScenesScheme = scheme;
  root.dispatchEvent(new CustomEvent('colorschemechange', { detail: scheme }));
}

/** Set the scheme that the visitor selects, and keep it for the next pages. */
export function chooseColorScheme(scheme: ColorScheme) {
  applyColorScheme(scheme);
  try {
    // Light is the default: keep only the choice of dark.
    if (scheme === 'light') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Without storage, the choice is for this page only.
  }
}
