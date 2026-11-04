import manifest from '~/data/pictures.json';

export type Picture = {
  section: string;
  title: string;
  alt: string;
  url: string;
  width: number;
  height: number;
};

const pictures = manifest as Record<string, Picture[]>;

export function picturesFor(pathname: string): Picture[] {
  return pictures[pathname.replace(/\/+$/, '') || '/'] ?? [];
}
