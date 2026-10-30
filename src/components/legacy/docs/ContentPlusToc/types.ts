export type TocEntry = {
  url: string;
  label: string;
  badge?: string;
};

export type TocGroup = {
  title: string;
  entries: TocEntry[];
};
