import type { BreadcrumbItem } from '~/components/Breadcrumb';

/**
 * The index pages that the breadcrumb of a detail page links to. A trail
 * starts with one of them. The next items come from the CMS (a category,
 * a course, a partner).
 */
export const indexes = {
  academy: { label: 'Academy', href: '/academy' },
  blog: { label: 'Blog', href: '/blog' },
  caseStudies: { label: 'Case studies', href: '/case-studies' },
  casualChats: { label: 'Casual chats', href: '/blog/casual-chats' },
  partners: { label: 'Partners', href: '/partners' },
  plugins: { label: 'Plugins', href: '/plugins' },
  productUpdates: { label: 'Product updates', href: '/product-updates' },
  starters: { label: 'Starters', href: '/starters' },
  techPartners: { label: 'Tech partners', href: '/tech-partners' },
  userGuides: { label: 'User guides', href: '/user-guides' },
} satisfies Record<string, BreadcrumbItem>;
