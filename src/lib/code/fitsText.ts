/*
 * The longest line, in characters, of a code block that stays at the width
 * of the text: it does not go past the sides of the text. The docs text is
 * 650px wide. The code is Geist Mono at 14px (8.4px for each character)
 * with the side padding of the code card, thus 70 characters fit in it.
 */
export const CODE_TEXT_WIDTH_CHARS = 70;

/** True when each line of the code fits in the width of the text. */
export function codeFitsText(code: string): boolean {
  return code.split('\n').every((line) => line.length <= CODE_TEXT_WIDTH_CHARS);
}
