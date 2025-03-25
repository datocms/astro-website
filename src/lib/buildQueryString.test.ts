import { describe, expect, it } from 'vitest';
import { buildQueryString } from './buildQueryString.ts';

describe('buildQueryString()', () => {
  describe('basic functionality', () => {
    it('should return an empty string for an empty object', () => {
      expect(buildQueryString({})).toBe('');
    });

    it('should correctly serialize a simple flat object', () => {
      const input = { a: '1', b: '2' };
      const result = buildQueryString(input);
      // Order is preserved so we expect the exact string.
      expect(result).toBe('a=1&b=2');
    });

    it('should correctly serialize nested objects', () => {
      const input = { a: { b: '2' } };
      const result = buildQueryString(input);
      expect(result).toBe('a[b]=2');
    });

    it('should correctly serialize arrays', () => {
      const input = { arr: ['one', 'two'] };
      const result = buildQueryString(input);
      // Expected: arr[]=one&arr[]=two
      expect(result).toBe('arr[]=one&arr[]=two');
    });

    it('should NOT encode special characters in values (for readability)', () => {
      const input = { key: 'a+b&c=d' };
      const result = buildQueryString(input);
      // encodeURIComponent('a+b&c=d') returns "a%2Bb%26c%3Dd"
      expect(result).not.toBe(`key=${encodeURIComponent('a+b&c=d')}`);
      expect(result).toBe(`key=a+b&c=d`);
    });

    it('should handle number values correctly', () => {
      const input = { num: 123 };
      const result = buildQueryString(input);
      expect(result).toBe('num=123');
    });

    it('ignores keys that are the literal "undefined" or "null"', () => {
      const input = {
        undefined: 'shouldBeIgnored',
        null: 'shouldAlsoBeIgnored',
        key: 'value',
      };
      // Expected only the valid key to be serialized.
      expect(buildQueryString(input)).toEqual('key=value');
    });

    it('ignores properties with undefined or null values', () => {
      const input = {
        key1: 'value1',
        key2: undefined,
        key3: null,
      };
      // Only key1 should appear in the query string.
      expect(buildQueryString(input)).toEqual('key1=value1');
    });

    it('serializes arrays and ignores undefined or null items', () => {
      const input = {
        arr: ['a', null, 'b', undefined, { key: 'val' }],
      };
      // Expected output:
      // "arr[]=a" for the first item,
      // "arr[]=b" for the third item,
      // and "arr[][key]=val" for the object.
      expect(buildQueryString(input)).toEqual('arr[]=a&arr[]=b&arr[][key]=val');
    });

    it('serializes nested params while ignoring invalid keys/values', () => {
      const input = {
        filter: {
          type: 'blah',
          fields: {
            name: { in: ['blah', 'test'] },
          },
        },
        undefined: 'shouldBeIgnored',
        null: 'shouldAlsoBeIgnored',
        extra: null,
      };

      expect(buildQueryString(input)).toEqual(
        'filter[type]=blah&filter[fields][name][in][]=blah&filter[fields][name][in][]=test',
      );
    });

    it('encodes spaces as %20 in primitive values', () => {
      const input = {
        key: 'a value',
      };
      // Note: The function replaces only the first space.
      expect(buildQueryString(input)).toEqual('key=a%20value');
    });
  });

  describe('specific examples from docs', () => {
    it('records belonging to a model', () => {
      const input = {
        filter: {
          // Filtering by the model with api_key "cat" and the model with ID of "dog"
          type: 'cat,MtzQYUvbS-S0LM2LZ5QlkQ',
        },
      };
      const result = buildQueryString(input);
      expect(result).toBe('filter[type]=cat,MtzQYUvbS-S0LM2LZ5QlkQ');
    });

    it('filter by field values & sort by updatedAt', () => {
      const input = {
        filter: {
          type: 'dog',

          fields: {
            name: {
              in: ['Buddy', 'Rex'],
            },

            breed: {
              eq: 'mixed',
            },
          },

          _updated_at: {
            gt: '2020-04-18T00:00:00',
          },
        },

        order_by: '_updated_at_ASC',
      };

      const result = buildQueryString(input);
      expect(result).toBe(
        'filter[type]=dog&filter[fields][name][in][]=Buddy&filter[fields][name][in][]=Rex&filter[fields][breed][eq]=mixed&filter[_updated_at][gt]=2020-04-18T00:00:00&order_by=_updated_at_ASC',
      );
    });

    it('fetch records by a generic textual query', () => {
      const input = {
        filter: {
          // optional, if defined, search in the specified models only

          type: 'dog,cat',

          query: 'chicken',
        },

        locale: 'en',

        order_by: '_rank_DESC', // possible values: `_rank_DESC` (default) | `_rank_ASC`
      };

      const result = buildQueryString(input);
      expect(result).toBe(
        'filter[type]=dog,cat&filter[query]=chicken&locale=en&order_by=_rank_DESC',
      );
    });
  });
});
