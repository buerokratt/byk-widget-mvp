import { useEffect, useLayoutEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return () => null;
    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
