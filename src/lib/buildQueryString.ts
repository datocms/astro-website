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
 *   order_by: '_updated_at_ASC'
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
        if (Object.hasOwn(subObj, key)) {
          const value = subObj[key];
          // Build the full key; if there's a parent key, nest the current key.
          const fullKey = parentKey ? `${parentKey}[${key}]` : key;

          if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
              // Reduce over the array immutably.
              const arrayPairs = value.reduce((arrAcc: string[], item) => {
                if (item !== null && typeof item === 'object') {
                  // Recursively serialize objects inside arrays.
                  return [...arrAcc, serialize(item, `${fullKey}[]`)];
                } else {
                  // For primitive array items, add them directly.
                  return [
                    ...arrAcc,
                    `${encodeURIComponent(fullKey)}[]=${encodeURIComponent(item)}`,
                  ];
                }
              }, [] as string[]);
              return [...acc, ...arrayPairs];
            } else {
              // Recursively serialize nested objects.
              return [...acc, serialize(value, fullKey)];
            }
          } else {
            // For primitive values, encode the key/value pair.
            return [...acc, `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`];
          }
        }
        return acc;
      }, [])
      .filter(Boolean)
      .join('&');

  return serialize(obj);
};
