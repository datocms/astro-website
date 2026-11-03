import type { ContactPoint } from '~/components/ContactCard';
import type { logos } from '~/components/Emoji/emojis';
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

export type { ContactPoint };

/** The mark of a framework (src/assets/frameworks). */
export type FrameworkLogo = keyof typeof logos;

export interface ButtonData {
  label: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  logos?: FrameworkLogo[];
  contact?: ContactPoint;
  /** Overrides the theme of the section. */
  theme?: Theme;
}
