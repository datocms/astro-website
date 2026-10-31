import { createRoot } from 'react-dom/client';

import { Search } from './index';

/*
 * Mount a Search with no own trigger and open it. The site layout calls
 * this on the first click on a `data-search-open` element, or on the first
 * Cmd/Ctrl+K. After that, the Search handles these events itself.
 */
export function mountSearch(opener: HTMLElement | null) {
  const host = document.createElement('div');
  document.body.append(host);
  createRoot(host).render(<Search variant="none" defaultOpen opener={opener} />);
}

/* Load the modal code too, so that the first open has no delay. */
export function prefetchSearch() {
  void import('./LazyModal');
}
