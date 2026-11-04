export type TocEntry = {
  url: string;
  label: string;
  badge?: string;
};

export type TocGroup = {
  /** The label above the entries. The headings of the page have no label. */
  title?: string;
  entries: TocEntry[];
};
