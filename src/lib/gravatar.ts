import { createHash } from 'node:crypto';

/**
 * The Gravatar of an email. Without a Gravatar, the image is transparent
 * (`d=blank`), not the logo of Gravatar: the page shows what is below it.
 */
export function getGravatarUrl(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = createHash('md5').update(normalizedEmail).digest('hex');
  return `https://secure.gravatar.com/avatar/${hash}?s=200&d=blank`;
}
