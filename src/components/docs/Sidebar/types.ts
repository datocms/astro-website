export type SidebarEntry = {
  label: string;
  url: string;
  entries?: SidebarEntry[];
};

export type SidebarGroup = {
  title: string;
  entries: SidebarEntry[];
};
