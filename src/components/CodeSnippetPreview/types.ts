import type { CodeLang } from '~/lib/code/highlight';

/** A tab of CodeSnippetPreview: the code as text, highlighted by Shiki. */
export interface CodeTab {
  label: string;
  /** The code, as it is written in the file. */
  code: string;
  lang: CodeLang;
  /**
   * The lines that carry the point of the snippet, from 1: a line, or the
   * first and the last line of a range. The other lines are dim. Without
   * it, no line is dim.
   */
  focus?: (number | [number, number])[];
  /**
   * From 1152px, a comment line of the code shows as a note next to the
   * card, with a line to the code it tells about. Below 1152px, and with
   * no JavaScript, the comment stays in the code.
   */
  notes?: CodeNote[];
}

export interface CodeNote {
  /** The line of the comment, from 1. */
  comment: number;
  /** The text that the note points to, on a line after the comment. */
  point: string;
}
