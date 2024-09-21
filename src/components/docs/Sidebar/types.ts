import type { ActiveLinkMatch } from '~/components/links/ActiveLink/types';

export type SidebarEntry = {
  label: string;
  url: string;
  entries?: SidebarEntry[];
  match?: ActiveLinkMatch;
};

export type SidebarGroup = {
  title: string;
  entries: SidebarEntry[];
};
