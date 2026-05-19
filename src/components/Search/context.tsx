import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

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

type SearchMeta = {
  aiInitialQuestion: string | undefined;
};

type SearchContextValue = {
  state: SearchState;
  actions: SearchActions;
  meta: SearchMeta;
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
    }),
    [screen, searchInput, onClose, goHome, goSearch, goAi, aiInitialQuestion],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
