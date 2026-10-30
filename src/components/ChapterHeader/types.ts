import type { ButtonData } from '~/data/home';

export interface ChapterHeaderData {
  /** The name of the feature, as a small label above the headline. */
  label: string;
  /** The headline, 6 words at most. */
  headline: string;
  /** The muted second part of the two-tone headline. */
  muted?: string;
  /** One or two sentences, 25 words at most. */
  intro: string;
  /** An optional link, e.g. to the docs. */
  link?: ButtonData;
}
