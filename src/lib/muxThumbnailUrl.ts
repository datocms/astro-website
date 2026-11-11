/**
 * Set the query parameters of a Mux thumbnail URL. DatoCMS gives the URL
 * with a query string (`?time=1.0`), thus do not append a second `?`.
 * Skip a parameter with an undefined or null value.
 */
export function muxThumbnailUrl(
  thumbnailUrl: string,
  params: Record<string, string | number | undefined | null>,
): string {
  const url = new URL(thumbnailUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}
