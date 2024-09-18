import type { Result } from './types';
import { Highlight } from './Highlight';
import ky from 'ky';
import type { SchemaTypes } from '@datocms/cma-client';

const matchRegexp = /\[h\](.+?)\[\/h\]/g;

export async function searchInWebsite(query: string) {
  const { data: results } = await ky<SchemaTypes.SearchResultInstancesTargetSchema>(
    'https://site-api.datocms.com/search-results',
    {
      headers: {
        Authorization: 'Bearer d46fe8134ea916b42af4eaa0d06109',
        Accept: 'application/json',
      },
      searchParams: {
        fuzzy: 'true',
        'filter[query]': query,
        'filter[build_trigger_id]': '7497',
        'page[limit]': 30,
      },
    },
  ).json();

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
