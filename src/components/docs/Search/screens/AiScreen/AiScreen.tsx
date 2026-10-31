import cn from 'classnames';
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import s from '../../style.module.css';
import { ModalHeader } from '../../modal/Header';
import { ModalInputRow } from '../../modal/InputRow';
import { ModalBody } from '../../modal/Body';
import { ModalDisclaimer } from '../../modal/Disclaimer';
import { useSearch } from '../../context';
import { aiStarterPrompts } from '../../constants';
import type { AskAiHandle } from './AskAi';

import questionIcon from '~/icons/regular/messages.svg?raw';
import magicIcon from '~/icons/regular/sparkles.svg?raw';

const AskAi = lazy(() => import('./AskAi').then((m) => ({ default: m.AskAi })));

export function AiScreen() {
  const {
    state: { searchInput },
    actions: { setSearchInput, goHome, goAi },
    meta: { aiInitialQuestion },
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const askAiRef = useRef<AskAiHandle | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isAsking = aiInitialQuestion !== undefined;

  useEffect(() => {
    inputRef.current?.focus();
  }, [isAsking]);

  const filteredAiPrompts = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return aiStarterPrompts;
    return aiStarterPrompts.filter((p) => p.toLowerCase().includes(q));
  }, [searchInput]);

  const totalItems = isAsking ? 0 : filteredAiPrompts.length;

  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current.querySelector('[data-selected="true"]');
    if (el) (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIndex]);

  const activatePromptSelection = () => {
    const prompt = filteredAiPrompts[selectedIndex];
    if (prompt) goAi(prompt);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isAsking && totalItems > 0) {
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isAsking && totalItems > 0) {
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
      return;
    }
    if (e.key === 'Backspace' && searchInput === '' && !isAsking) {
      e.preventDefault();
      goHome();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const term = searchInput.trim();
      if (!term) {
        if (!isAsking) activatePromptSelection();
        return;
      }
      if (isAsking) {
        askAiRef.current?.submit(term);
        setSearchInput('');
      } else {
        goAi(term);
      }
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInput(e.target.value);
    setSelectedIndex(0);
  };

  return (
    <>
      <ModalHeader title="Ask AI" />
      <ModalBody ref={bodyRef} className={!isAsking ? s.cardBodyEndAligned : undefined}>
        {isAsking ? (
          <Suspense fallback={<p className={s.statusLine}>Loading…</p>}>
            <AskAi ref={askAiRef} initialQuestion={aiInitialQuestion} />
          </Suspense>
        ) : (
          <>
            {filteredAiPrompts.length > 0 && <div className={s.sectionLabel}>Try asking</div>}
            {filteredAiPrompts.map((prompt, i) => (
              <button
                key={prompt}
                type="button"
                className={cn(s.row, selectedIndex === i && s.rowSelected)}
                data-selected={selectedIndex === i || undefined}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => goAi(prompt)}
              >
                <span className={s.rowIcon} dangerouslySetInnerHTML={{ __html: questionIcon }} />
                <span className={s.rowLabel}>{prompt}</span>
              </button>
            ))}
          </>
        )}
      </ModalBody>
      <ModalInputRow
        inputRef={inputRef}
        name="ai-query"
        type="text"
        placement="bottom"
        placeholder={isAsking ? 'Ask a follow-up question…' : 'Ask a question…'}
        value={searchInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        icon={magicIcon}
      />
      <ModalDisclaimer />
    </>
  );
}
