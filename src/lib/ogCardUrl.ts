export type OgCardData = {
  kicker?: string | null;
  title: string;
  pills?: string[] | null;
  excerpt?: string | null;
};

export function ogCardUrl(data: OgCardData): string {
  const url = new URL('/og-card.png', 'http://bogus.com');
  url.searchParams.set('data', JSON.stringify(data));
  return url.pathname + url.search;
}
