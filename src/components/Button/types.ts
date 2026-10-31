import type { Theme } from '~/lib/theme';

export type ButtonAppearance =
  'deep-on-white' | 'light-on-white' | 'deep-on-light' | 'light-on-deep';

export interface ButtonImage {
  src: string;
  alt?: string;
}

export interface ButtonData {
  label: string;
  href: string;
  appearance: ButtonAppearance;
  variant?: 'solid' | 'soft';
  arrow?: boolean;
  leading?: 'userpic' | 'logos';
  leadingImages?: ButtonImage[];
  /** Overrides the theme of the section. */
  theme?: Theme;
}
