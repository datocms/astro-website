import cn from 'classnames';
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import s from '../style.module.css';
import { ModalInputRow } from '../modal/InputRow';
import { ModalBody } from '../modal/Body';
import { useSearch } from '../context';
import { goToEntries } from '../constants';

import bookIcon from '~/icons/regular/book.svg?raw';
import magicIcon from '~/icons/regular/sparkles.svg?raw';
import arrowRightIcon from '~/icons/regular/arrow-right.svg?raw';

export function HomeScreen() {
  const {
    state: { searchInput },
    actions: { setSearchInput, closeModal, goSearch, goAi },
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (el.value) el.select();
    else el.focus();
  }, []);

  const trimmedQuery = searchInput.trim();

  const filteredGoTo = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return goToEntries;
    return goToEntries.filter((g) => g.label.toLowerCase().includes(q));
  }, [trimmedQuery]);

  const totalItems = 2 + filteredGoTo.length;

  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current.querySelector('[data-selected="true"]');
    if (el) (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIndex]);

  const activateSelection = () => {
    if (selectedIndex === 0) {
      goSearch();
      return;
    }
    if (selectedIndex === 1) {
      goAi(searchInput);
      return;
    }
    const entry = filteredGoTo[selectedIndex - 2];
    if (entry) window.location.href = entry.url;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalItems);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      activateSelection();
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInput(e.target.value);
    setSelectedIndex(0);
  };

  return (
    <>
      <ModalInputRow
        inputRef={inputRef}
        name="query"
        placeholder="Search or ask anything…"
        value={searchInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <ModalBody ref={bodyRef}>
        <div className={s.sectionLabel}>Search</div>
        <button
          type="button"
          className={cn(s.row, selectedIndex === 0 && s.rowSelected)}
          data-selected={selectedIndex === 0 || undefined}
          onMouseEnter={() => setSelectedIndex(0)}
          onClick={goSearch}
        >
          <span className={s.rowIcon} dangerouslySetInnerHTML={{ __html: bookIcon }} />
          <span className={s.rowLabel}>
            {trimmedQuery ? (
              <>
                <strong>Search</strong> for &ldquo;{trimmedQuery}&rdquo;
              </>
            ) : (
              'Search'
            )}
          </span>
        </button>
        <button
          type="button"
          className={cn(s.row, selectedIndex === 1 && s.rowSelected)}
          data-selected={selectedIndex === 1 || undefined}
          onMouseEnter={() => setSelectedIndex(1)}
          onClick={() => goAi(searchInput)}
        >
          <span className={s.rowIcon} dangerouslySetInnerHTML={{ __html: magicIcon }} />
          <span className={s.rowLabel}>
            {trimmedQuery ? (
              <>
                <strong>Ask AI</strong> about &ldquo;{trimmedQuery}&rdquo;
              </>
            ) : (
              'Ask AI'
            )}
          </span>
        </button>

        {filteredGoTo.length > 0 && (
          <>
            <div className={s.sectionLabel}>Quick links</div>
            {filteredGoTo.map((entry, i) => {
              const idx = i + 2;
              return (
                <a
                  key={entry.url}
                  href={entry.url}
                  className={cn(s.row, selectedIndex === idx && s.rowSelected)}
                  data-selected={selectedIndex === idx || undefined}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={closeModal}
                >
                  <span
                    className={s.rowIcon}
                    dangerouslySetInnerHTML={{ __html: arrowRightIcon }}
                  />
                  <span className={s.rowLabel}>{entry.label}</span>
                </a>
              );
            })}
          </>
        )}
      </ModalBody>
    </>
  );
}
