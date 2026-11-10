import type { IconData } from '~/components/Icon/data';
import {
  AppWindow,
  Book,
  BookOpen,
  GraduationCap,
  Menu,
  MessageSquareText,
  MessagesSquare,
  PenTool,
  Rocket,
  Scale,
  Trophy,
  Video,
  WandSparkles,
} from 'lucide';
import { siGithub } from 'simple-icons';
import type { SearchFilter } from './apis/search';

export type Area = { id: string; label: string; icon: IconData };

export const areasBySource: Record<string, Area> = {
  skills: { id: 'skills', label: 'Agent Skills', icon: WandSparkles },
  docs: { id: 'docs', label: 'Docs', icon: BookOpen },
  github: { id: 'github', label: 'GitHub', icon: siGithub },
  blog: { id: 'blog', label: 'Blog', icon: PenTool },
  'case-studies': { id: 'case-studies', label: 'Case Studies', icon: Trophy },
  academy: { id: 'academy', label: 'CMS Academy', icon: GraduationCap },
  'casual-chats': { id: 'casual-chats', label: 'Customer Interviews', icon: MessagesSquare },
  'product-updates': { id: 'product-updates', label: 'Product Updates', icon: Rocket },
  glossary: { id: 'glossary', label: 'Glossary', icon: Book },
  compare: { id: 'compare', label: 'Comparisons', icon: Scale },
  'user-guides': { id: 'user-guides', label: 'User Guides', icon: Video },
  marketing: { id: 'marketing', label: 'Website', icon: AppWindow },
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

export const otherArea: Area = { id: 'other', label: 'Elsewhere', icon: Menu };
export const communityArea: Area = { id: 'community', label: 'Community', icon: MessageSquareText };

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
