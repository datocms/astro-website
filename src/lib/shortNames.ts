import { stripStega } from '@datocms/astro';

const words = (name: string) => stripStega(name).split(' ');
const firstName = (name: string) => words(name)[0] ?? name;

/**
 * The short names of a group of people: the first names. When two people
 * have the same first name, the name gets the initial of the last name
 * ("Matteo B."). In draft mode, a name ends with the stega of Content Link:
 * the short name keeps it.
 */
export function shortNames(names: string[]): string[] {
  return names.map((name) => {
    const first = firstName(name);
    const initial = words(name).at(-1)?.[0];
    const isShared = names.filter((other) => firstName(other) === first).length > 1;
    const stega = name.slice(stripStega(name).length);
    return (isShared && initial ? `${first} ${initial}.` : first) + stega;
  });
}

/** A list in a sentence: "A", "A and B", "A, B and C". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}
