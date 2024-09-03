/**
 * Returns a slugified version of the string by converting the input to
 * lowercase, eliminating non-alphanumeric characters, and removing any hyphens
 * at the beginning or end of the string.
 */
export const slugify = (str: string | null) =>
  str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : undefined;
