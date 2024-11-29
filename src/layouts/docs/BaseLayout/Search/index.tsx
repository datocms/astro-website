import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import s from './style.module.css';
import type { Result } from './types';
import { searchInWebsite } from './searchInWebsite';
import { searchInCommunity } from './searchInCommunity';

import hamburgerIcon from '~/icons/regular/bars.svg?raw';

const areas = [
  { id: 'general_concepts', label: 'General Concepts' },
  { id: 'user_guides', label: 'User Guides' },
  { id: 'academy', label: 'Headless CMS Academy' },
  { id: 'content_modelling', label: 'Content Modelling' },
  { id: 'environments', label: 'Environments and Migrations Guide' },
  { id: 'cda', label: 'Content Delivery API Reference' },
  { id: 'cma', label: 'Content Management API Reference' },
  { id: 'plugin_sdk', label: 'Plugin SDK' },
  { id: 'nuxt', label: 'Nuxt Integration Guide' },
  { id: 'nextjs', label: 'Next Integration Guide.js' },
  { id: 'remix', label: 'Remix Integration Guide' },
  { id: 'sveltekit', label: 'SvelteKit Integration Guide' },
  { id: 'docs', label: 'Documentation' },
  { id: 'blog', label: 'Blog' },
  { id: 'product_updates', label: 'Product Updates' },
  { id: 'other', label: 'Elsewhere on the website' },
  { id: 'community', label: 'Community' },
] as const;

const routeToAreaMatchers: Array<{ match: string; area: (typeof areas)[number]['id'] }> = [
  { match: '/user-guides', area: 'user_guides' },
  { match: '/academy', area: 'academy' },
  { match: '/docs/scripting-migrations', area: 'environments' },
  { match: '/docs/general-concepts', area: 'general_concepts' },
  { match: '/docs/content-modelling', area: 'content_modelling' },
  { match: '/docs/nuxt', area: 'nuxt' },
  { match: '/docs/next-js', area: 'nextjs' },
  { match: '/docs/remix', area: 'remix' },
  { match: '/docs/svelte', area: 'sveltekit' },
  { match: '/docs/content-delivery-api', area: 'cda' },
  { match: '/docs/content-management-api', area: 'cma' },
  { match: '/docs/plugin-sdk', area: 'plugin_sdk' },
  { match: '/docs', area: 'docs' },
  { match: '/blog', area: 'blog' },
  { match: '/product-updates', area: 'product_updates' },
  { match: 'https://community.datocms.com', area: 'community' },
];

async function search(query: string) {
  const [docs, community] = await Promise.all([searchInWebsite(query), searchInCommunity(query)]);

  const resultsByArea: Record<string, Result[]> = {};
  const urls: string[] = [];

  for (const result of [...docs, ...community]) {
    if (urls.includes(result.url)) {
      continue;
    }

    urls.push(result.url);

    const foundArea = routeToAreaMatchers.find((matcher) => result.url.includes(matcher.match));
    const area = foundArea ? foundArea.area : 'other';

    resultsByArea[area] = resultsByArea[area] || [];
    resultsByArea[area].push(result);
  }

  return resultsByArea;
}

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Record<string, Result[]>>({});
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);

      search(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults({});
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className={cn(s.overlay, searchTerm && s.visible)} onClick={() => setSearchTerm('')} />
      <div className={cn(s.searchResults, searchTerm && s.visible)}>
        {isSearching && (
          <div className={s.spinning}>
            <div />
            <div />
          </div>
        )}
        <div className={s.results}>
          {areas.map((area) => {
            if (!results[area.id]) {
              return null;
            }

            return (
              <div key={area.id} className={s.area}>
                <div className={s.areaTitle}>{area.label}</div>
                {results[area.id]!.map((result) => (
                  <a href={result.url} key={result.url} className={s.result}>
                    <div dangerouslySetInnerHTML={{ __html: hamburgerIcon }} />
                    <div>
                      <div className={s.resultTitle}>{result.title}</div>
                      {result.body && <div className={s.resultBody}>{result.body}</div>}
                    </div>
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <form className={s.formSearch}>
        <input
          name="query"
          type="search"
          placeholder="Search in the docs and community..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </form>
    </>
  );
}
