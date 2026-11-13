import type { ImageMetadata } from 'astro';
import type { Theme } from '~/lib/theme';
import { blogCoverThemes } from './blogCoverThemes';

/*
 * The cover and the theme of a blog post, by the slug of the post. The CMS
 * has no fields for them. Thus the covers are files in
 * src/assets/blog-covers/ (the name of the file is the slug), and the theme
 * of each post is in src/data/blogCoverThemes.ts.
 *
 * A cover is a grid of 100 × 58 square cells, with one pixel for each cell.
 * PixelCover draws it. The rules and the process are in
 * src/components/PixelCover/AGENTS.md.
 */

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/blog-covers/*.png', {
  eager: true,
});

export type BlogCover = { slug: string; image: ImageMetadata; theme: Theme };

/** The cover of the post with this slug, or undefined when it has none. */
export function blogCover(slug: string): BlogCover | undefined {
  const file = files[`../assets/blog-covers/${slug}.png`];
  const theme = blogCoverThemes[slug];
  if (!file || !theme) return undefined;
  return { slug, image: file.default, theme };
}

/** The cover of the post at this address (`/blog/<slug>`). */
export function blogCoverForHref(href: string) {
  return blogCover(href.split('/').pop() ?? '');
}

/** All the covers, in the order of src/data/blogCoverThemes.ts. */
export function allBlogCovers(): BlogCover[] {
  return Object.keys(blogCoverThemes)
    .map(blogCover)
    .filter((cover): cover is BlogCover => cover !== undefined);
}
