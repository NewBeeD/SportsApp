// hooks/useInfiniteScroll.js
import { useRef, useEffect, useCallback } from 'react';

const useInfiniteScroll = (onIntersect, options = {}) => {
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      onIntersect();
    }
  }, [onIntersect]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // Load before reaching the bottom
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);
    
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return loaderRef;
};

export default useInfiniteScroll;