import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallbackRef = useRef();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => savedCallbackRef.current(...args);

    if (delay !== null) {
      const intervalId = setInterval(handler, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
};
