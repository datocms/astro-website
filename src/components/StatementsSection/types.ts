import type { Theme } from '~/lib/theme';

export interface StatementsItem {
  /** Style `statement`: the title. Style `stat`: the value. Style `text`: not used. */
  title?: string;
  /** Style `statement`: the tagline. Style `stat`: the label. Style `text`: the paragraph. */
  text: string;
}

export interface StatementsSectionData {
  items: StatementsItem[];
  /** An optional H1 above the columns. */
  headline?: string;
  /** Without a theme, the section inherits the theme of its parent. */
  theme?: Theme;
}
