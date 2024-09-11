export type Entry = {
  label: string;
  url: string;
  entries?: Entry[];
};

export type Group = {
  label: string;
  entries: Entry[];
};
