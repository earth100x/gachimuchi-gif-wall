import { renderHook, act } from '@testing-library/react';
import { useTenorAPI } from '../../hooks/useTenorAPI';
import { TenorAPIClient } from '../../services/tenorAPI';
import { mockTenorResponse } from '../../__mocks__/tenorAPI';

// Mock the TenorAPIClient
jest.mock('../../services/tenorAPI');
const MockedTenorAPIClient = TenorAPIClient as jest.MockedClass<typeof TenorAPIClient>;

// Mock fetch globally
global.fetch = jest.fn();

describe('useTenorAPI', () => {
  const mockApiKey = 'test-api-key';
  let mockSearchGifs: jest.Mock;
  let mockGetTrending: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSearchGifs = jest.fn();
    mockGetTrending = jest.fn();
    
    MockedTenorAPIClient.mockImplementation(() => ({
      searchGifs: mockSearchGifs,
      getTrending: mockGetTrending,
    }) as unknown as TenorAPIClient);
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    expect(result.current.gifs).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(false);
  });

  it('should search for GIFs successfully', async () => {
    mockSearchGifs.mockResolvedValue(mockTenorResponse);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.gifs).toHaveLength(3);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(true);
    expect(mockSearchGifs).toHaveBeenCalledWith('gachimuchi', 8, undefined);
  });

  it('should handle search errors', async () => {
    const errorMessage = 'API error';
    mockSearchGifs.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.gifs).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.hasMore).toBe(false);
  });

  it('should handle empty search query', async () => {
    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    await act(async () => {
      await result.current.searchGifs('', 8);
    });

    expect(result.current.error).toBe('Search query cannot be empty');
    expect(mockSearchGifs).not.toHaveBeenCalled();
  });

  it('should append results when loading more', async () => {
    const firstResponse = { ...mockTenorResponse, next: 'next-token' };
    const secondResponse = { ...mockTenorResponse, results: mockTenorResponse.results.slice(0, 1) };
    
    mockSearchGifs
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    // First search
    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.gifs).toHaveLength(3);
    expect(result.current.hasMore).toBe(true);

    // Load more
    await act(async () => {
      await result.current.loadMore('gachimuchi', 8);
    });

    expect(result.current.gifs).toHaveLength(4); // 3 + 1
    expect(mockSearchGifs).toHaveBeenCalledTimes(2);
    expect(mockSearchGifs).toHaveBeenLastCalledWith('gachimuchi', 8, 'next-token');
  });

  it('should get trending GIFs successfully', async () => {
    mockGetTrending.mockResolvedValue(mockTenorResponse);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    await act(async () => {
      await result.current.getTrending(8);
    });

    expect(result.current.gifs).toHaveLength(3);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockGetTrending).toHaveBeenCalledWith(8);
  });

  it('should clear GIFs and reset state', async () => {
    mockSearchGifs.mockResolvedValue(mockTenorResponse);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    // First search to populate state
    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.gifs).toHaveLength(3);

    // Clear GIFs
    act(() => {
      result.current.clearGifs();
    });

    expect(result.current.gifs).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(false);
  });

  it('should retry failed search', async () => {
    const errorMessage = 'Network error';
    mockSearchGifs
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockTenorResponse);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    // First search fails
    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.error).toBe(errorMessage);

    // Retry succeeds
    await act(async () => {
      await result.current.retry('gachimuchi', 8);
    });

    expect(result.current.gifs).toHaveLength(3);
    expect(result.current.error).toBe(null);
    expect(mockSearchGifs).toHaveBeenCalledTimes(2);
  });

  it('should not load more when already loading', async () => {
    mockSearchGifs.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    // Start loading
    act(() => {
      result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.loading).toBe(true);

    // Try to load more while loading
    await act(async () => {
      await result.current.loadMore('gachimuchi', 8);
    });

    // Should only call searchGifs once
    expect(mockSearchGifs).toHaveBeenCalledTimes(1);
  });

  it('should not load more when no more results', async () => {
    const responseWithoutNext = { ...mockTenorResponse, next: undefined };
    mockSearchGifs.mockResolvedValue(responseWithoutNext);

    const { result } = renderHook(() => useTenorAPI(mockApiKey));

    // First search
    await act(async () => {
      await result.current.searchGifs('gachimuchi', 8);
    });

    expect(result.current.hasMore).toBe(false);

    // Try to load more
    await act(async () => {
      await result.current.loadMore('gachimuchi', 8);
    });

    // Should only call searchGifs once
    expect(mockSearchGifs).toHaveBeenCalledTimes(1);
  });
});
