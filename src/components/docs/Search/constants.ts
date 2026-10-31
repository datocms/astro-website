import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faBars,
  faBook,
  faBookBlank,
  faBrowser,
  faComments,
  faGraduationCap,
  faMessageLines,
  faPenNib,
  faRocket,
  faScaleBalanced,
  faTrophy,
  faVideo,
  faWandMagic,
} from '@fortawesome/pro-regular-svg-icons';
import type { SearchFilter } from './apis/search';

export type Area = { id: string; label: string; icon: IconDefinition };

export const areasBySource: Record<string, Area> = {
  skills: { id: 'skills', label: 'Agent Skills', icon: faWandMagic },
  docs: { id: 'docs', label: 'Docs', icon: faBook },
  github: { id: 'github', label: 'GitHub', icon: faGithub },
  blog: { id: 'blog', label: 'Blog', icon: faPenNib },
  'case-studies': { id: 'case-studies', label: 'Case Studies', icon: faTrophy },
  academy: { id: 'academy', label: 'CMS Academy', icon: faGraduationCap },
  'casual-chats': { id: 'casual-chats', label: 'Customer Interviews', icon: faComments },
  'product-updates': { id: 'product-updates', label: 'Product Updates', icon: faRocket },
  glossary: { id: 'glossary', label: 'Glossary', icon: faBookBlank },
  compare: { id: 'compare', label: 'Comparisons', icon: faScaleBalanced },
  'user-guides': { id: 'user-guides', label: 'User Guides', icon: faVideo },
  marketing: { id: 'marketing', label: 'Website', icon: faBrowser },
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

export const otherArea: Area = { id: 'other', label: 'Elsewhere', icon: faBars };
export const communityArea: Area = { id: 'community', label: 'Community', icon: faMessageLines };

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
