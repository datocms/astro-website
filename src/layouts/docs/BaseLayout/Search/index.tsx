import cn from 'classnames';
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import s from './style.module.css';
import type { Result } from './types';
import { searchInWebsite } from './searchInWebsite';
import { searchInCommunity } from './searchInCommunity';

import hamburgerIcon from '~/icons/regular/bars.svg?raw';
import guideIcon from '~/icons/regular/book.svg?raw';
import forumIcon from '~/icons/regular/comment-alt-lines.svg?raw';
import pageIcon from '~/icons/regular/file.svg?raw';
import codeIcon from '~/icons/regular/code.svg?raw';
import apiIcon from '~/icons/regular/cog.svg?raw';

type Areas = { id: string; label: string; icon?: string; urlMatch?: string }[];

const areas: Areas = [
  {
    id: 'general_concepts',
    label: 'General Concepts',
    icon: guideIcon,
    urlMatch: '/docs/general-concepts',
  },
  {
    id: 'user_guides',
    label: 'User Guides',
    icon: guideIcon,
    urlMatch: '/user-guides',
  },
  {
    id: 'academy',
    label: 'Headless CMS Academy',
    icon: guideIcon,
    urlMatch: '/academy',
  },
  {
    id: 'content_modelling',
    label: 'Content Modelling',
    icon: guideIcon,
    urlMatch: '/docs/content-modelling',
  },
  {
    id: 'environments',
    label: 'Environments and Migrations Guide',
    icon: guideIcon,
    urlMatch: '/docs/scripting-migrations',
  },
  {
    id: 'cda',
    label: 'Content Delivery API Reference',
    icon: apiIcon,
    urlMatch: '/docs/content-delivery-api',
  },
  {
    id: 'cma',
    label: 'Content Management API Reference',
    icon: apiIcon,
    urlMatch: '/docs/content-management-api',
  },
  {
    id: 'plugin_sdk',
    label: 'Plugin SDK',
    icon: apiIcon,
    urlMatch: '/docs/plugin-sdk',
  },
  {
    id: 'nuxt',
    label: 'Nuxt Integration Guide',
    icon: codeIcon,
    urlMatch: '/docs/nuxt',
  },
  {
    id: 'nextjs',
    label: 'Next Integration Guide.js',
    icon: codeIcon,
    urlMatch: '/docs/next-js',
  },
  {
    id: 'remix',
    label: 'Remix Integration Guide',
    icon: codeIcon,
    urlMatch: '/docs/remix',
  },
  {
    id: 'sveltekit',
    label: 'SvelteKit Integration Guide',
    icon: codeIcon,
    urlMatch: '/docs/svelte',
  },
  {
    id: 'docs',
    label: 'Developer Docs',
    icon: codeIcon,
    urlMatch: '/docs',
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: pageIcon,
    urlMatch: '/blog',
  },
  {
    id: 'product_updates',
    label: 'Product Updates',
    icon: pageIcon,
    urlMatch: '/product-updates',
  },
  {
    id: 'other',
    label: 'Elsewhere on the website',
    icon: pageIcon,
  },
  {
    id: 'community',
    label: 'Community',
    icon: forumIcon,
    urlMatch: 'https://community.datocms.com',
  },
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

    const foundArea = areas.find((area) => area.urlMatch && result.url.includes(area.urlMatch));
    const area = foundArea ? foundArea.id : 'other';

    resultsByArea[area] = resultsByArea[area] || [];
    resultsByArea[area].push(result);
  }

  return resultsByArea;
}

export function Search() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [results, setResults] = useState<Record<string, Result[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false); // Waiting for network call?
  const [isDirty, setIsDirty] = useState<boolean>(false); // Waiting for debounce?
  const debouncedSearchTerm = useDebounce<string>(searchInput, 500);
  const hasResults = useMemo<boolean>(() => Object.values(results)?.length > 0, [results]);

  const performSearch = (searchTerm: string) => {
    setIsLoading(true);

    search(searchTerm).then((results) => {
      setIsLoading(false);
      setResults(results);
      if ('posthog' in window) {
        (window as any).posthog.capture('docs_search');
      }
    });
  };

  useEffect(() => {
    setIsDirty(false);
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    } else {
      setResults({});
    }
  }, [debouncedSearchTerm]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    setIsDirty(false);
    const searchTerm = e.currentTarget.value;
    if (!searchTerm) {
      return;
    }

    setSearchInput(searchTerm);
    performSearch(searchTerm);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsDirty(true);
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className={cn(s.overlay, searchInput && s.visible)} onClick={() => setSearchInput('')} />
      <div className={cn(s.searchResults, searchInput && s.visible)}>
        {isLoading && (
          <div className={s.spinning}>
            <div />
            <div />
          </div>
        )}
        <div className={s.results}>
          {isLoading && <p>Searching for "{searchInput}"...</p>}

          {!isDirty &&
            !isLoading &&
            hasResults &&
            areas.map((area) => {
              if (!results[area.id]) {
                return null;
              }

              return (
                <div key={area.id} className={s.area}>
                  <div className={s.areaTitle}>{area.label}</div>
                  {results[area.id]!.map((result) => (
                    <a href={result.url} key={result.url} className={s.result}>
                      <div dangerouslySetInnerHTML={{ __html: area.icon ?? hamburgerIcon }} />
                      <div>
                        <div className={s.resultTitle}>{result.title}</div>
                        {result.body && <div className={s.resultBody}>{result.body}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              );
            })}

          {!isDirty && !isLoading && !hasResults && searchInput && (
            <p>Sorry, no results found for "{searchInput}".</p>
          )}
        </div>
      </div>
      <form className={s.formSearch} onSubmit={(e) => e.preventDefault()}>
        <input
          name="query"
          type="search"
          placeholder="Search in the docs and community..."
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </form>
    </>
  );
}
