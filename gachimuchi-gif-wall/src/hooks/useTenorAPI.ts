import { useState, useCallback, useMemo } from 'react';
import { GIF } from '../types';
import { TenorAPIClient } from '../services/tenorAPI';

/**
 * Custom hook for Tenor API integration
 * Manages state for GIFs, loading, and error handling
 */
export const useTenorAPI = (apiKey: string) => {
  const [gifs, setGifs] = useState<GIF[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPos, setNextPos] = useState<string | undefined>(undefined);

  const apiClient = useMemo(() => new TenorAPIClient(apiKey), [apiKey]);

  /**
   * Search for GIFs with the given query
   * @param query - Search query string
   * @param limit - Maximum number of results (default: 8)
   * @param append - Whether to append results to existing list (default: false)
   */
  const searchGifs = useCallback(async (
    query: string,
    limit: number = 8,
    append: boolean = false
  ) => {
    if (!query.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.searchGifs(query, limit, append ? nextPos : undefined);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      if (append) {
        setGifs(prev => [...prev, ...response.results]);
      } else {
        setGifs(response.results);
      }

      setHasMore(!!response.next);
      setNextPos(response.next);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Search GIFs Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiClient, nextPos]);

  /**
   * Load more GIFs (pagination)
   * @param query - Original search query
   * @param limit - Maximum number of results (default: 8)
   */
  const loadMore = useCallback(async (query: string, limit: number = 8) => {
    if (!hasMore || loading) return;
    
    await searchGifs(query, limit, true);
  }, [hasMore, loading, searchGifs]);

  /**
   * Get trending GIFs
   * @param limit - Maximum number of results (default: 8)
   */
  const getTrending = useCallback(async (limit: number = 8) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getTrending(limit);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      setGifs(response.results);
      setHasMore(!!response.next);
      setNextPos(response.next);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Get Trending Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  /**
   * Clear current GIFs and reset state
   */
  const clearGifs = useCallback(() => {
    setGifs([]);
    setError(null);
    setHasMore(false);
    setNextPos(undefined);
  }, []);

  /**
   * Retry the last search operation
   * @param query - Search query to retry
   * @param limit - Maximum number of results (default: 8)
   */
  const retry = useCallback(async (query: string, limit: number = 8) => {
    if (error) {
      await searchGifs(query, limit, false);
    }
  }, [error, searchGifs]);

  return {
    gifs,
    loading,
    error,
    hasMore,
    searchGifs,
    loadMore,
    getTrending,
    clearGifs,
    retry
  };
};
