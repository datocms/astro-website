export type OgCardData = {
  kicker?: string | null;
  title: string;
  pills?: string[] | null;
  excerpt?: string | null;
};

export function ogCardUrl(data: OgCardData, baseUrl: URL): string {
  const url = new URL('/og-card.png', baseUrl);
  url.searchParams.set('data', JSON.stringify(data));
  return url.toString();
}
