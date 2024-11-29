import { useEffect, useState } from 'react';

export function parseUrlSearchParams(urlParams: URLSearchParams) {
  const topicsParam = urlParams.get('topics');

  return {
    topicSlugs: topicsParam ? topicsParam.split('/') : [],
    email: urlParams.get('email'),
    errorId: urlParams.get('errorId'),
    projectUrl: urlParams.get('projectUrl'),
  };
}

export function useSearchParams(initialLocationSearch: string | undefined) {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(
      typeof window === 'undefined' ? initialLocationSearch : window.location.search,
    ),
  );

  useEffect(() => {
    // Function to update searchParams state
    const updateSearchParams = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    // Listen for popstate event (triggered on browser back/forward)
    window.addEventListener('popstate', updateSearchParams);

    // Listen for pushState and replaceState calls
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(this, arguments as any);
      updateSearchParams();
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments as any);
      updateSearchParams();
    };

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', updateSearchParams);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return searchParams;
}
