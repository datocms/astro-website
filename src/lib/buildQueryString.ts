/**
 * Recursively serializes a nested object into a URL query string using immutable operations.
 *
 * This function converts a nested object into a URL query string. It handles nested objects
 * and arrays (using the `[]` syntax) similar to how many server-side frameworks expect them.
 *
 * @example
 * ```typescript
 * const params = {
 *   filter: {
 *     type: 'dog',
 *     fields: {
 *       name: { in: ['Buddy', 'Rex'] },
 *       breed: { eq: 'mixed' },
 *       _updated_at: { gt: '2020-04-18T00:00:00' }
 *     }
 *   },
 *   order_by: '_updated_at_ASC',
 *   undefined: 'shouldBeIgnored',
 *   null: 'shouldAlsoBeIgnored',
 *   extra: null,
 * };
 *
 * const queryString = buildQueryString(params);
 * console.log(queryString);
 * // Expected output:
 * // filter[type]=dog&filter[fields][name][in][]=Buddy&filter[fields][name][in][]=Rex&filter[fields][breed][eq]=mixed&filter[fields][_updated_at][gt]=2020-04-18T00%3A00%3A00&order_by=_updated_at_ASC
 * ```
 *
 * @param obj - The object to be serialized.
 * @returns A URL query string representation of the provided object.
 */
export const buildQueryString = (obj: Record<string, any>): string => {
  /**
   * Internal helper function that recursively serializes the object.
   *
   * @param subObj - The current object (or sub-object) to serialize.
   * @param parentKey - The prefix for nested keys (empty for the top level).
   * @returns A partial query string for the given object.
   */
  const serialize = (subObj: any, parentKey: string = ''): string =>
    Object.keys(subObj)
      .reduce((acc: string[], key) => {
        // Skip keys that are either the literal "undefined" or "null".
        if (key === 'undefined' || key === 'null') {
          return acc;
        }
        if (Object.hasOwn(subObj, key)) {
          const value = subObj[key];
          // Also ignore properties whose value is undefined or null.
          if (value === undefined || value === null) {
            return acc;
          }
          // Build the full key; if there's a parent key, nest the current key.
          const fullKey = parentKey ? `${parentKey}[${key}]` : key;

          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              // Reduce over the array immutably.
              const arrayPairs = value.reduce((arrAcc: string[], item) => {
                // If an array item is null or undefined, skip it.
                if (item === undefined || item === null) {
                  return arrAcc;
                }
                if (typeof item === 'object') {
                  // Recursively serialize objects inside arrays.
                  return [...arrAcc, serialize(item, `${fullKey}[]`)];
                } else {
                  // For primitive array items, add them directly.
                  return [...arrAcc, `${fullKey}[]=${item}`];
                }
              }, [] as string[]);
              return [...acc, ...arrayPairs];
            } else {
              // Recursively serialize nested objects.
              return [...acc, serialize(value, fullKey)];
            }
          } else {
            // For primitive values, replace spaces with '%20' for readability.
            return [...acc, `${fullKey}=${value.toString().replace(' ', '%20')}`];
          }
        }
        return acc;
      }, [])
      .filter(Boolean)
      .join('&');

  return serialize(obj);
};
