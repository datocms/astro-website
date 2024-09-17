export function intersperse<T, S>(arr: T[], sep: S, endSep = sep): Array<T|S> {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    (xs, x, i) => {
      return xs.concat([i === arr.length - 2 ? endSep : sep, x]);
    },
    [arr[0]] as (T | S)[],
  );
}