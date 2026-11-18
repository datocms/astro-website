import { describe, expect, it } from 'vitest';
import { emojiSegments } from './emojiSegments';

describe('emojiSegments', () => {
  it('gives one text segment for a line without emojis', () => {
    expect(emojiSegments('Hello, world')).toEqual([{ type: 'text', value: 'Hello, world' }]);
  });

  it('gives no segments for an empty line', () => {
    expect(emojiSegments('')).toEqual([]);
  });

  it('divides the line at each emoji that has a drawing', () => {
    expect(emojiSegments('Made with 💚 in Italy ✨')).toEqual([
      { type: 'text', value: 'Made with ' },
      { type: 'emoji', value: '💚', drawn: '💚' },
      { type: 'text', value: ' in Italy ' },
      { type: 'emoji', value: '✨', drawn: '✨' },
    ]);
  });

  it('keeps a sequence as one emoji', () => {
    expect(emojiSegments('a ❤️ b')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'emoji', value: '❤️', drawn: '❤️' },
      { type: 'text', value: ' b' },
    ]);
    expect(emojiSegments('🇮🇹')).toEqual([{ type: 'emoji', value: '🇮🇹', drawn: '🇮🇹' }]);
  });

  it('draws an emoji with a skin tone as the emoji without the tone', () => {
    expect(emojiSegments('👍🏽')).toEqual([{ type: 'emoji', value: '👍🏽', drawn: '👍' }]);
  });

  it('keeps digits and symbols of text as text', () => {
    expect(emojiSegments('1 # © → ✓')).toEqual([{ type: 'text', value: '1 # © → ✓' }]);
  });

  it('keeps the hidden characters of Content Link in the text', () => {
    // A zero-width joiner and other hidden characters directly after an emoji.
    const hidden = '‍​‌﻿‍';
    expect(emojiSegments(`Thanks 💚${hidden}`)).toEqual([
      { type: 'text', value: 'Thanks ' },
      { type: 'emoji', value: '💚', drawn: '💚' },
      { type: 'text', value: hidden },
    ]);
  });
});
