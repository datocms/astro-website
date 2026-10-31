import type { ReactNode } from 'react';

export type Result = {
  title: ReactNode;
  url: string;
  category?: string;
  blurb?: ReactNode;
  date?: string;
};
