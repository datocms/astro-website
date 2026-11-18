import { pixelEmojiDrawing } from '~/components/PixelEmoji';

/**
 * A part of a line: text, or one emoji that has a pixel drawing. `value` is
 * the emoji of the text and `drawn` is the emoji of the drawing.
 */
export type EmojiSegment =
  { type: 'text'; value: string } | { type: 'emoji'; value: string; drawn: string };

// One emoji as Unicode recommends it: a ZWJ sequence, a flag and an emoji
// with a skin tone are one match. The hidden characters of Content Link
// include a zero-width joiner, but they are not an emoji, thus they stay in
// the text.
const EMOJI = /\p{RGI_Emoji}/gv;

const SKIN_TONE = /[\u{1f3fb}-\u{1f3ff}]/gu;

/**
 * Gets the emoji to draw. Most emojis with a skin tone have no drawing:
 * they use the drawing of the emoji without the tone.
 */
function drawnEmoji(emoji: string): string | undefined {
  if (pixelEmojiDrawing(emoji)) return emoji;
  const noTone = emoji.replace(SKIN_TONE, '');
  return noTone && noTone !== emoji && pixelEmojiDrawing(noTone) ? noTone : undefined;
}

/**
 * Divides a line into text and the emojis that have a pixel drawing. An
 * emoji without a drawing stays in the text.
 */
export function emojiSegments(line: string): EmojiSegment[] {
  const segments: EmojiSegment[] = [];
  let text = '';
  let end = 0;

  for (const match of line.matchAll(EMOJI)) {
    const emoji = match[0];
    text += line.slice(end, match.index);
    end = match.index + emoji.length;

    const drawn = drawnEmoji(emoji);
    if (drawn) {
      if (text) segments.push({ type: 'text', value: text });
      segments.push({ type: 'emoji', value: emoji, drawn });
      text = '';
    } else {
      text += emoji;
    }
  }

  text += line.slice(end);
  if (text) segments.push({ type: 'text', value: text });
  return segments;
}
