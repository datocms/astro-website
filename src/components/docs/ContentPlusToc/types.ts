export type TocEntry = {
  url: string;
  label: string;
};

export type TocGroup = {
  title: string;
  entries: TocEntry[];
};
