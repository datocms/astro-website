import { areasBySource, communityArea, otherArea } from '../../constants';
import { searchInWebsite, type SearchFilter } from '../../apis/search';
import { searchInCommunity } from '../../apis/community';
import type { ResultWithArea } from './types';

export type FetchMode = { kind: 'docs'; filter: SearchFilter } | { kind: 'community' };

export async function fetchResults(
  query: string,
  mode: FetchMode,
  signal?: AbortSignal,
): Promise<ResultWithArea[]> {
  if (mode.kind === 'community') {
    const results = await searchInCommunity(query, signal);
    const seen = new Set<string>();
    return results.flatMap((r) => {
      if (seen.has(r.url)) return [];
      seen.add(r.url);
      return [{ ...r, area: communityArea }];
    });
  }
  const results = await searchInWebsite(query, mode.filter, signal);
  return results.map((r) => ({
    ...r,
    area: (r.source && areasBySource[r.source]) || otherArea,
  }));
}
