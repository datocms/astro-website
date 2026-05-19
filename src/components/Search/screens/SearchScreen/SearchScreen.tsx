import cn from 'classnames';
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import s from '../../style.module.css';
import { ModalHeader } from '../../modal/Header';
import { ModalInputRow } from '../../modal/InputRow';
import { ModalBody } from '../../modal/Body';
import { useSearch } from '../../context';
import { ALL_GROUP_ID, COMMUNITY_GROUP_ID, groups, searchStarterPrompts } from '../../constants';
import { searchInCommunity } from '../../apis/community';
import { FilterChips } from './FilterChips';
import { ResultsList } from './ResultsList';
import { SkeletonResults } from './SkeletonResults';
import { fetchResults } from './fetchResults';
import type { ResultWithArea } from './types';

import searchIcon from '~/icons/regular/magnifying-glass.svg?raw';

export function SearchScreen() {
  const {
    state: { searchInput },
    actions: { setSearchInput },
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<ResultWithArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL_GROUP_ID);
  const [communityCount, setCommunityCount] = useState(0);

  const trimmedInput = searchInput.trim();
  const debouncedSearchTerm = useDebounce<string>(trimmedInput, 200);
  const isPending = trimmedInput !== debouncedSearchTerm;
  const hasResults = results.length > 0;
  const isShowingPrompts = !trimmedInput;
  const isQueryLongEnough = debouncedSearchTerm.length >= 2;
  const totalItems = isShowingPrompts ? searchStarterPrompts.length : results.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isQueryLongEnough) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    const group = groups.find((g) => g.id === selectedGroup);
    const mode =
      selectedGroup === COMMUNITY_GROUP_ID || !group?.filter
        ? ({ kind: 'community' } as const)
        : ({ kind: 'docs', filter: group.filter } as const);
    const controller = new AbortController();
    setIsLoading(true);
    fetchResults(debouncedSearchTerm, mode, controller.signal)
      .then((res) => {
        setResults(res);
        setIsLoading(false);
        if ('posthog' in window) (window as any).posthog.capture('docs_search');
      })
      .catch((error) => {
        if ((error as Error)?.name === 'AbortError') return;
        setIsLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearchTerm, selectedGroup, isQueryLongEnough]);

  useEffect(() => {
    if (!isQueryLongEnough) {
      setCommunityCount(0);
      return;
    }
    const controller = new AbortController();
    searchInCommunity(debouncedSearchTerm, controller.signal)
      .then((res) => {
        const unique = new Set(res.map((r) => r.url));
        setCommunityCount(unique.size);
      })
      .catch((error) => {
        if ((error as Error)?.name === 'AbortError') return;
        setCommunityCount(0);
      });
    return () => controller.abort();
  }, [debouncedSearchTerm, isQueryLongEnough]);

  const showCommunity = communityCount > 1;

  useEffect(() => {
    if (!showCommunity && selectedGroup === COMMUNITY_GROUP_ID) {
      setSelectedGroup(ALL_GROUP_ID);
    }
  }, [showCommunity, selectedGroup]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current.querySelector('[data-selected="true"]');
    if (el) (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIndex]);

  const activateSelection = () => {
    if (isShowingPrompts) {
      const prompt = searchStarterPrompts[selectedIndex];
      if (prompt) setSearchInput(prompt);
      return;
    }
    const result = results[selectedIndex];
    if (result) window.open(result.url, '_blank');
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const isNavKey = e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter';
    if (!isNavKey) return;
    e.preventDefault();
    if (!isShowingPrompts && (isLoading || isPending)) return;
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (totalItems === 0 ? 0 : (prev + 1) % totalItems));
      return;
    }
    if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (totalItems === 0 ? 0 : (prev - 1 + totalItems) % totalItems));
      return;
    }
    activateSelection();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInput(e.target.value);
    setSelectedIndex(0);
  };

  return (
    <>
      <ModalHeader title="Search" />
      <ModalInputRow
        inputRef={inputRef}
        name="query"
        placeholder="Search…"
        value={searchInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <ModalBody ref={bodyRef}>
        {isShowingPrompts ? (
          <>
            <div className={s.sectionLabel}>Try searching for</div>
            {searchStarterPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className={cn(s.row, selectedIndex === i && s.rowSelected)}
                data-selected={selectedIndex === i || undefined}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => setSearchInput(prompt)}
              >
                <span className={s.rowIcon} dangerouslySetInnerHTML={{ __html: searchIcon }} />
                <span className={s.rowLabel}>{prompt}</span>
              </button>
            ))}
          </>
        ) : (
          <>
            <FilterChips
              selected={selectedGroup}
              onSelect={setSelectedGroup}
              showCommunity={showCommunity}
            />

            {isLoading || isPending ? (
              <SkeletonResults />
            ) : hasResults ? (
              <ResultsList
                results={results}
                selectedIndex={selectedIndex}
                onHover={setSelectedIndex}
              />
            ) : null}

            {!isPending && !isLoading && !hasResults && isQueryLongEnough && (
              <p className={s.statusLine}>
                Sorry, no results found for &ldquo;{trimmedInput}&rdquo;.
              </p>
            )}
          </>
        )}
      </ModalBody>
    </>
  );
}
