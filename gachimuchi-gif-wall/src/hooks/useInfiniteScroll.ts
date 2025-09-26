import { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  delayInMs?: number;
}

interface UseInfiniteScrollReturn {
  loadMore: () => void;
  isIntersecting: boolean;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for infinite scroll functionality using Intersection Observer API
 * @param callback - Function to call when intersection occurs
 * @param options - Configuration options for the intersection observer
 * @returns Object with loadMore function, intersection state, and target ref
 */
export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px 100px 0px',
    enabled = true,
    delayInMs = 200
  } = options;

  const targetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isIntersectingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loadMore = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (isProcessingRef.current) {
      console.log('Load more blocked: already processing');
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isProcessingRef.current = true;
      console.log('Loading more...');
      try {
        callbackRef.current();
      } finally {
        // Reset processing flag after a short delay to prevent rapid successive calls
        setTimeout(() => {
          isProcessingRef.current = false;
          console.log('Processing complete, ready for next call');
        }, 500);
      }
    }, delayInMs);
  }, [delayInMs]);

  useEffect(() => {
    if (!enabled || !targetRef.current) {
      return;
    }

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isIntersectingRef.current = entry.isIntersecting;

        console.log('Intersection observer triggered:', {
          isIntersecting: entry.isIntersecting,
          isProcessing: isProcessingRef.current,
          intersectionRatio: entry.intersectionRatio
        });

        if (entry.isIntersecting && !isProcessingRef.current) {
          console.log('Triggering load more...');
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Start observing the target element
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, threshold, rootMargin, loadMore]);

  return {
    loadMore,
    isIntersecting: isIntersectingRef.current,
    targetRef,
  };
};
