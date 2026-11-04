import manifest from '~/data/pictures.json';

export type Picture = {
  section: string;
  file: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

const pictures = manifest as Record<string, Picture[]>;

export function picturesFor(pathname: string): Picture[] {
  return pictures[pathname.replace(/\/+$/, '') || '/'] ?? [];
}

export function pictureUrl(base: string | URL, picture: Picture) {
  return new URL(`/pictures/${picture.file}`, base).href;
}
