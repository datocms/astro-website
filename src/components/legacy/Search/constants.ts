import type { SearchFilter } from './apis/search';

import githubIcon from '~/icons/brands/github.svg?raw';
import hamburgerIcon from '~/icons/regular/bars.svg?raw';
import bookAltIcon from '~/icons/regular/book-blank.svg?raw';
import bookIcon from '~/icons/regular/book.svg?raw';
import browserIcon from '~/icons/regular/browser.svg?raw';
import commentsIcon from '~/icons/regular/comments.svg?raw';
import graduationCapIcon from '~/icons/regular/graduation-cap.svg?raw';
import forumIcon from '~/icons/regular/message-lines.svg?raw';
import penNibIcon from '~/icons/regular/pen-nib.svg?raw';
import rocketIcon from '~/icons/regular/rocket.svg?raw';
import balanceScaleIcon from '~/icons/regular/scale-balanced.svg?raw';
import trophyIcon from '~/icons/regular/trophy.svg?raw';
import videoIcon from '~/icons/regular/video.svg?raw';
import wandMagicIcon from '~/icons/regular/wand-magic.svg?raw';

export type Area = { id: string; label: string; icon: string };

export const areasBySource: Record<string, Area> = {
  skills: { id: 'skills', label: 'Agent Skills', icon: wandMagicIcon },
  docs: { id: 'docs', label: 'Docs', icon: bookIcon },
  github: { id: 'github', label: 'GitHub', icon: githubIcon },
  blog: { id: 'blog', label: 'Blog', icon: penNibIcon },
  'case-studies': { id: 'case-studies', label: 'Case Studies', icon: trophyIcon },
  academy: { id: 'academy', label: 'CMS Academy', icon: graduationCapIcon },
  'casual-chats': { id: 'casual-chats', label: 'Customer Interviews', icon: commentsIcon },
  'product-updates': { id: 'product-updates', label: 'Product Updates', icon: rocketIcon },
  glossary: { id: 'glossary', label: 'Glossary', icon: bookAltIcon },
  compare: { id: 'compare', label: 'Comparisons', icon: balanceScaleIcon },
  'user-guides': { id: 'user-guides', label: 'User Guides', icon: videoIcon },
  marketing: { id: 'marketing', label: 'Website', icon: browserIcon },
};

export type Group = { id: string; label: string; filter?: SearchFilter };

export const ALL_GROUP_ID = 'all';
export const COMMUNITY_GROUP_ID = 'community';

export const groups: Group[] = [
  {
    id: ALL_GROUP_ID,
    label: 'Top picks',
    filter: { exclude: ['skills', 'blog', 'product-updates'] },
  },
  {
    id: 'developers',
    label: 'For Developers',
    filter: { include: ['docs', 'github', 'skills'] },
  },
  {
    id: 'editors',
    label: 'For Editors',
    filter: { include: ['academy', 'glossary', 'user-guides'] },
  },
  { id: 'news', label: 'News', filter: { include: ['blog', 'product-updates'] } },
  {
    id: 'customers',
    label: 'Stories',
    filter: { include: ['case-studies', 'casual-chats'] },
  },
  { id: COMMUNITY_GROUP_ID, label: 'Community' },
];

export const otherArea: Area = { id: 'other', label: 'Elsewhere', icon: hamburgerIcon };
export const communityArea: Area = { id: 'community', label: 'Community', icon: forumIcon };

export type GoToEntry = { label: string; url: string };

export const goToEntries: GoToEntry[] = [
  { label: 'General Concepts', url: '/docs/general-concepts' },
  { label: 'Content Modelling', url: '/docs/content-modelling' },
  { label: 'Content Delivery API (CDA)', url: '/docs/content-delivery-api' },
  { label: 'Content Management API (CMA)', url: '/docs/content-management-api' },
  { label: 'Plugin SDK', url: '/docs/plugin-sdk/introduction' },
  { label: 'Next.js quickstart', url: '/docs/next-js' },
];

export const searchStarterPrompts = [
  'Visual Editing',
  'Structured Text',
  'Modular content',
  'Cache Tags',
  'Plugin SDK',
  'MCP Server',
];

export const aiStarterPrompts = [
  'How do I fetch content from DatoCMS?',
  'How can I optimize my website cache?',
  "What's the difference between a model and a block?",
  'What a DatoCMS plugin can offer?',
  'Can I offer click-to-edit experience to my editors, straight from the site?',
  "What is a DatoCMS environment, and why it's useful?",
];
