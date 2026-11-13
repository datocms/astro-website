import type { Theme } from '~/lib/theme';

/*
 * The theme of each blog post that has a cover, by the slug of the post. The
 * CMS has no field for it. The theme gives the colours of the cover and of
 * the page of the post.
 *
 * This module imports no Vite feature: scripts/blog-covers/gen.ts reads it.
 * The cover files are in src/assets/blog-covers/ (see src/data/blogCovers.ts).
 *
 * The order is the order of /dev/cover-gallery: the featured rows of the blog,
 * three covers in each row. The three covers of a row have three different
 * themes.
 */
export const blogCoverThemes: Record<string, Theme> = {
  // All posts, Engineering
  'four-bugs-in-a-trenchcoat-record-locking': 'purple',
  'handling-less-common-scripts': 'yellow',
  'how-to-make-your-website-agent-ready': 'orange',
  // Product news
  'introducing-the-new-datocms-remote-mcp': 'green',
  'the-new-datocms-agent-skills': 'blue',
  'major-changes-to-managing-content-programmatically': 'orange',
  // Guides
  'the-editors-guide-to-working-with-datocms-plugins': 'blue',
  'headless-cms-for-llms': 'yellow',
  'schema-import-exports-and-recipes': 'orange',
  // Perspectives
  'agentic-commerce-content-layer': 'pink',
  'headless-cms-personalization': 'purple',
  'when-to-use-skills-vs-the-datocms-mcp': 'blue',
  // Company
  'introducing-tuply': 'blue',
  'introducing-our-2026-pricing-changes': 'purple',
  'a-look-back-at-2025': 'green',
};
