import { describe, expect, it } from 'vitest';
import { muxThumbnailUrl } from './muxThumbnailUrl';

describe('muxThumbnailUrl', () => {
  it('overrides an existing query param instead of duplicating the separator', () => {
    const result = muxThumbnailUrl(
      'https://image.mux.com/u00QZVbQH3qwq5cEeplgtT51LJvmU00eQ5/thumbnail.jpg?time=1.0',
      { time: 180, width: 600, height: 400, fit_mode: 'crop' },
    );

    expect(result).toBe(
      'https://image.mux.com/u00QZVbQH3qwq5cEeplgtT51LJvmU00eQ5/thumbnail.jpg?time=180&width=600&height=400&fit_mode=crop',
    );
  });

  it('adds params to a URL without an existing query string', () => {
    const result = muxThumbnailUrl('https://image.mux.com/abc/thumbnail.jpg', {
      time: 0,
    });

    expect(result).toBe('https://image.mux.com/abc/thumbnail.jpg?time=0');
  });

  it('skips undefined and null values', () => {
    const result = muxThumbnailUrl('https://image.mux.com/abc/thumbnail.jpg?time=1.0', {
      time: undefined,
      width: null,
    });

    expect(result).toBe('https://image.mux.com/abc/thumbnail.jpg?time=1.0');
  });
});
