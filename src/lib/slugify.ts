/**
 * Returns a slugified version of the string by converting the input to
 * lowercase, eliminating non-alphanumeric characters, and removing any hyphens
 * at the beginning or end of the string.
 */

export function slugify(str: string): string;
export function slugify(str: null | undefined): undefined;
export function slugify(str: string | null | undefined): string | undefined;

export function slugify(str: string | null | undefined): string | undefined {
  return str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : undefined;
}
