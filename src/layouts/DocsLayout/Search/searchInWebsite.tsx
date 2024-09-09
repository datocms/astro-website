import { buildClient } from '@datocms/cma-client';
import type { Result } from './types';
import { Highlight } from './Highlight';

const client = buildClient({ apiToken: 'd46fe8134ea916b42af4eaa0d06109 ' });
const matchRegexp = /\[h\](.+?)\[\/h\]/g;

export async function searchInWebsite(query: string) {
  const { data: results } = await client.searchResults.rawList({
    fuzzy: 'true',
    filter: {
      query: query,
      build_trigger_id: '7497',
    },
    page: {
      limit: 30,
    },
  });

  return results.map<Result>((result) => {
    const highlightTitle = result.attributes.highlight.title?.[0];
    const highlightBody = result.attributes.highlight.body?.[0];

    return {
      url: result.attributes.url,
      title: highlightTitle ? (
        <Highlight regexp={matchRegexp}>
          {highlightTitle.replace(/ [—|-] DatoCMS.*$/, '')}
        </Highlight>
      ) : (
        result.attributes.title.replace(/ [—|-] DatoCMS.*$/, '')
      ),
      body: highlightBody ? (
        <Highlight regexp={matchRegexp}>{highlightBody}</Highlight>
      ) : (
        result.attributes.body_excerpt
      ),
    };
  });
}
