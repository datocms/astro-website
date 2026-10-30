import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { capture, isPostHogReady, makeSessionId } from './lib/posthog';

export type Screen = 'home' | 'search' | 'ai';

type SearchState = {
  screen: Screen;
  searchInput: string;
};

type SearchActions = {
  setSearchInput: (value: string) => void;
  closeModal: () => void;
  goHome: () => void;
  goSearch: () => void;
  goAi: (question?: string) => void;
};

type Telemetry = {
  posthogReady: boolean;
  trackSearchQuery: (props: { group: string; result_count: number }) => void;
  trackAiQuestion: (props: { turn_index: number }) => void;
  trackAiFeedback: (props: {
    sentiment: 'up' | 'down';
    turn_index: number;
    question?: string;
  }) => void;
};

type SearchMeta = {
  aiInitialQuestion: string | undefined;
};

type SearchContextValue = {
  state: SearchState;
  actions: SearchActions;
  meta: SearchMeta;
  telemetry: Telemetry;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const value = useContext(SearchContext);
  if (!value) throw new Error('useSearch must be used within a SearchProvider');
  return value;
}

type ProviderProps = {
  onClose: () => void;
  children: ReactNode;
};

export function SearchProvider({ onClose, children }: ProviderProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [searchInput, setSearchInput] = useState('');
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string | undefined>(undefined);

  const sessionIdRef = useRef<string>('');
  if (!sessionIdRef.current) sessionIdRef.current = makeSessionId();
  const usedSearchRef = useRef(false);
  const usedAiRef = useRef(false);
  const ranQueriesRef = useRef(0);
  const submittedQuestionsRef = useRef(0);
  const [posthogReady, setPosthogReady] = useState<boolean>(() => isPostHogReady());

  useEffect(() => {
    if (posthogReady) return;
    const interval = window.setInterval(() => {
      if (isPostHogReady()) {
        setPosthogReady(true);
        window.clearInterval(interval);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [posthogReady]);

  useEffect(() => {
    const sessionId = sessionIdRef.current;
    capture('search_modal_opened', { session_id: sessionId });
    return () => {
      capture('search_modal_closed', {
        session_id: sessionId,
        used_search: usedSearchRef.current,
        used_ai: usedAiRef.current,
        ran_query_count: ranQueriesRef.current,
        submitted_question_count: submittedQuestionsRef.current,
      });
    };
  }, []);

  const markPathUsed = useCallback((path: 'search' | 'ai') => {
    const usedRef = path === 'search' ? usedSearchRef : usedAiRef;
    const otherUsedRef = path === 'search' ? usedAiRef : usedSearchRef;
    if (usedRef.current) return;
    usedRef.current = true;
    const sessionId = sessionIdRef.current;
    if (otherUsedRef.current) {
      capture('search_path_fallback', {
        session_id: sessionId,
        from: path === 'search' ? 'ai' : 'search',
        to: path,
      });
    } else {
      capture('search_path_chosen', { session_id: sessionId, path });
    }
  }, []);

  const trackSearchQuery = useCallback<Telemetry['trackSearchQuery']>(
    (props) => {
      ranQueriesRef.current += 1;
      capture('search_query_ran', { session_id: sessionIdRef.current, ...props });
      if (props.result_count > 0) markPathUsed('search');
    },
    [markPathUsed],
  );

  const trackAiQuestion = useCallback<Telemetry['trackAiQuestion']>(
    (props) => {
      submittedQuestionsRef.current += 1;
      capture('ai_question_asked', { session_id: sessionIdRef.current, ...props });
      markPathUsed('ai');
    },
    [markPathUsed],
  );

  const trackAiFeedback = useCallback<Telemetry['trackAiFeedback']>((props) => {
    capture('ai_answer_feedback', { session_id: sessionIdRef.current, ...props });
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setAiInitialQuestion(undefined);
  }, []);

  const goSearch = useCallback(() => {
    setScreen('search');
  }, []);

  const goAi = useCallback((question?: string) => {
    const trimmed = question?.trim();
    setAiInitialQuestion(trimmed || undefined);
    setSearchInput('');
    setScreen('ai');
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({
      state: { screen, searchInput },
      actions: { setSearchInput, closeModal: onClose, goHome, goSearch, goAi },
      meta: { aiInitialQuestion },
      telemetry: { posthogReady, trackSearchQuery, trackAiQuestion, trackAiFeedback },
    }),
    [
      screen,
      searchInput,
      onClose,
      goHome,
      goSearch,
      goAi,
      aiInitialQuestion,
      posthogReady,
      trackSearchQuery,
      trackAiQuestion,
      trackAiFeedback,
    ],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
