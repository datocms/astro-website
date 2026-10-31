export type ActiveLinkMatch =
  | { samePathName: true; sameSearchParams?: boolean }
  | {
      alsoMatchChildPathnames: true;
    };
