/*
 * Blog: the index (/blog, /blog/p/[n]), the index of the casual chats
 * (/blog/casual-chats, /blog/casual-chats/p/[n]), the index of a category
 * (/blog/category/[slug], /blog/category/[slug]/p/[n]), the blog post
 * (/blog/[slug]) and the casual chat (/blog/casual-chats/[slug]). The
 * casual chats were at /casual-chats, and /casual-chats/* redirects here.
 * The posts come from DatoCMS, project
 * "DatoCMS Website" (id 205): this file has only the copy around them.
 */

import type { HeroData } from '~/data/home';

export const hero: HeroData = {
  label: 'Blog',
  headline: 'Welcome to the DatoCMS Blog.',
  subheadline: 'News, tips, and highlights from the team at DatoCMS',
  face: 'kiss',
};

/**
 * The first two links above the grid of the index. The links to the
 * categories of the posts come after them, from DatoCMS.
 */
export const filters = {
  all: { label: 'All posts', href: '/blog' },
  chats: { label: 'Casual chats', href: '/blog/casual-chats' },
};

/**
 * The cards on a page of an index. The grid shows `perPage` cards: 18 fill
 * the rows of 1, 2 and 3 columns. Page 1 of each index (all the posts, the
 * casual chats, a category) also has `featuredCount` cards in the featured
 * row, above the grid.
 */
export const perPage = 18;
export const featuredCount = 3;

/** The copy of RelatedPosts. The posts come from DatoCMS. */
export interface RelatedPostsData {
  headline: string;
  muted: string;
}

export const related: RelatedPostsData = {
  headline: 'Want more?',
  muted: 'Check out other recent stories we’ve written on our blog.',
};

/** The copy of RelatedPosts under a casual chat. */
export const relatedToChat: RelatedPostsData = {
  headline: 'Not all stories are alike.',
  muted:
    'Discover how different teams work with DatoCMS in their own unique and unconventional ways.',
};
