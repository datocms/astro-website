import { describe, expect, it } from 'vitest';
import { joinWithAnd, shortNames } from './shortNames';

describe('shortNames', () => {
  it('gives the first names', () => {
    expect(shortNames(['Marcelo Finamor', 'Roger Tuan'])).toEqual(['Marcelo', 'Roger']);
  });

  it('adds the initial of the last name when a first name repeats', () => {
    expect(shortNames(['Matteo Balocco', 'Matteo Giaccone', 'Stefano Verna'])).toEqual([
      'Matteo B.',
      'Matteo G.',
      'Stefano',
    ]);
  });
});

describe('joinWithAnd', () => {
  it('joins one, two and three items', () => {
    expect(joinWithAnd(['A'])).toBe('A');
    expect(joinWithAnd(['A', 'B'])).toBe('A and B');
    expect(joinWithAnd(['A', 'B', 'C'])).toBe('A, B and C');
  });
});
