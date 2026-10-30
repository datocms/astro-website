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
  subheadline: 'News, tips and highlights from the team at DatoCMS',
};

/**
 * The first two links above the grid of the index. The links to the
 * categories of the posts come after them, from DatoCMS.
 */
export const filters = {
  all: { label: 'All posts', href: '/blog' },
  chats: { label: 'Casual chats', href: '/blog/casual-chats' },
};

/** The number of posts on each page of the index. Even: the grid has two columns. */
export const perPage = 16;

/** The copy of RelatedPosts. The posts come from DatoCMS. */
export interface RelatedPostsData {
  headline: string;
  muted: string;
}

export const related: RelatedPostsData = {
  headline: 'Want more?',
  muted: "Check out other recent stories we've written on our blog.",
};

/** The copy of RelatedPosts under a casual chat. */
export const relatedToChat: RelatedPostsData = {
  headline: 'Not all stories are alike.',
  muted:
    'Discover how different teams work with DatoCMS in their own unique and unconventional ways.',
};
