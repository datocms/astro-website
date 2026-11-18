import { stripStega } from '@datocms/astro';
import { readFragment, type FragmentOf } from '~/lib/datocms/graphql';
import type { Theme } from '~/lib/theme';
import { PixelCoverFragment } from './graphql';

/** The themes that a post can have: the select of the field `theme` in the CMS. */
const POST_THEMES = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink'] as const;

type Post = FragmentOf<typeof PixelCoverFragment>;

/**
 * The theme of a post, or undefined when the post has none. In draft mode the
 * value has the stega of Content Link: an attribute must not contain it.
 */
export function postTheme(post: Post): Theme | undefined {
  const theme = stripStega(readFragment(PixelCoverFragment, post).theme ?? '');
  return POST_THEMES.find((name) => name === theme);
}

/**
 * The cover of a post: the file and the theme. Undefined when the post has no
 * file or no theme.
 */
export function pixelCover(post: Post) {
  const { pixelCover: file } = readFragment(PixelCoverFragment, post);
  const theme = postTheme(post);
  if (!file || !theme) return undefined;
  return { url: file.url, width: file.width ?? 100, height: file.height ?? 58, theme };
}
