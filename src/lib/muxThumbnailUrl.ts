/**
 * Builds a Mux thumbnail URL, setting/overriding query params.
 *
 * DatoCMS already returns `thumbnailUrl` with a query string (e.g. `?time=1.0`),
 * so naively appending `?time=...&width=...` produces a malformed URL with two
 * `?` separators. This helper merges params onto the existing query string,
 * overriding any param that's already present.
 *
 * @param thumbnailUrl - The Mux thumbnail URL, possibly already carrying a query string.
 * @param params - Params to set/override. `undefined`/`null` values are skipped.
 * @returns A well-formed URL string.
 */
export const muxThumbnailUrl = (
  thumbnailUrl: string,
  params: Record<string, string | number | undefined | null>,
): string => {
  const url = new URL(thumbnailUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    url.searchParams.set(key, value.toString());
  }

  return url.toString();
};
