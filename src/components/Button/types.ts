import type { Theme } from '~/lib/theme';

/**
 * The emphasis of a button. The ground under the button sets the colours
 * (the button roles in src/styles/tokens.css).
 *   accent  the loudest pill: the accent on the page. On the accent and
 *           on the inverse grounds it is the same as solid.
 *   solid   the main action: the colour that contrasts most with the ground.
 *   soft    the secondary action: a faint tint.
 */
export type ButtonVariant = 'accent' | 'solid' | 'soft';

/**
 * The size of a button.
 *   m  40px tall, the label size (the default).
 *   l  48px tall, the body size: a hero, a page closer.
 */
export type ButtonSize = 'm' | 'l';

export interface ButtonImage {
  src: string;
  alt?: string;
}

export interface ButtonData {
  label: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  leading?: 'userpic' | 'logos';
  leadingImages?: ButtonImage[];
  /** Overrides the theme of the section. */
  theme?: Theme;
}
