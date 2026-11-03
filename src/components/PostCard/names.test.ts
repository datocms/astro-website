import { describe, expect, it } from 'vitest';
import { shortByline } from './names';

describe('shortByline', () => {
  it('gives one name and no count for one person', () => {
    expect(shortByline(['Ada'])).toEqual({ first: 'Ada', others: 0, spoken: '' });
  });

  it('counts the people after the first', () => {
    expect(shortByline(['Ada', 'Bo'])).toEqual({ first: 'Ada', others: 1, spoken: 'and 1 other' });
    expect(shortByline(['Ada', 'Bo', 'Cy', 'Di', 'Ed', 'Fy', 'Gi', 'Hu'])).toEqual({
      first: 'Ada',
      others: 7,
      spoken: 'and 7 others',
    });
  });
});
