/*
 * The color scheme of the site: light or dark. The scheme is the
 * attribute data-color-scheme on <html> (src/styles/tokens.css). The product
 * scenes follow data-product-scenes-scheme on <html> (the README of
 * @datocms/product-scenes). The inline script of
 * src/components/SchemeScript sets both before the first paint, with the
 * same constants and the same rule as here: the choice of the visitor,
 * else the scheme of the system.
 */

export type ColorScheme = 'light' | 'dark';

export const STORAGE_KEY = 'color-scheme';
export const SYSTEM_DARK = '(prefers-color-scheme: dark)';

export function currentColorScheme(): ColorScheme {
  return document.documentElement.dataset.colorScheme === 'dark' ? 'dark' : 'light';
}

function applyColorScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  root.dataset.colorScheme = scheme;
  root.dataset.productScenesScheme = scheme;
  root.dispatchEvent(new CustomEvent('colorschemechange', { detail: scheme }));
}

function storedColorScheme(): ColorScheme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/** Set the scheme that the visitor selects, and keep it for the next pages. */
export function chooseColorScheme(scheme: ColorScheme) {
  applyColorScheme(scheme);
  try {
    // The scheme of the system again: forget the choice.
    if (scheme === (matchMedia(SYSTEM_DARK).matches ? 'dark' : 'light'))
      localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Without storage, the choice is for this page only.
  }
}

/** Follow a change of the scheme of the system, when the visitor has no choice. */
export function followSystemColorScheme() {
  matchMedia(SYSTEM_DARK).addEventListener('change', (event) => {
    if (storedColorScheme() === null) applyColorScheme(event.matches ? 'dark' : 'light');
  });
}
