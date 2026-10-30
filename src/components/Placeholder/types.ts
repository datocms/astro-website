import type { Theme } from '~/lib/theme';

/*
 * A placeholder section: a section that does not exist yet.
 * The copy phase (AGENTS.md, "Workflow") uses it when no existing section fits.
 * The design phase replaces each placeholder with a real section.
 */

/** A text, a list of texts, or a list of items (each item has its fields). */
export type PlaceholderValue = string | string[] | PlaceholderField[][];

export interface PlaceholderField {
  /** The name of the field, e.g. "Headline", "Button", "Cards". */
  label: string;
  value: PlaceholderValue;
}

export interface PlaceholderData {
  /** A short name for the new section, e.g. "Integration logos wall". */
  name: string;
  /** One sentence: what the section must do for the reader. */
  intent: string;
  /** A description of the visual, e.g. "Screenshot of the schema builder". */
  visual?: string;
  fields: PlaceholderField[];
  /** Without a theme, the section inherits the theme of its parent. */
  theme?: Theme;
}
