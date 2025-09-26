import { TenorAPIClient } from '../../services/tenorAPI';
import { 
  mockTenorResponseWithError, 
  mockTenorAPIData,
  mockFetch, 
  mockFetchNetworkError,
  mockFetchRateLimit 
} from '../../__mocks__/tenorAPI';

// Mock fetch globally
global.fetch = jest.fn();

describe('TenorAPIClient', () => {
  let client: TenorAPIClient;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    client = new TenorAPIClient(mockApiKey);
    jest.clearAllMocks();
  });

  describe('searchGifs', () => {
    it('should search for GIFs successfully', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      const result = await client.searchGifs('gachimuchi', 8);

      expect(result.results).toHaveLength(3);
      expect(result.next).toBe('next-token-123');
      expect(result.error).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('g.tenor.com/v1/search'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorResponseWithError)
      );

      const result = await client.searchGifs('gachimuchi', 8);

      expect(result.error).toBe('API rate limit exceeded');
      expect(result.results).toHaveLength(0);
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch({}, false, 500)
      );

      await expect(client.searchGifs('gachimuchi', 8))
        .rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle rate limiting', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchRateLimit()
      );

      await expect(client.searchGifs('gachimuchi', 8))
        .rejects.toThrow('Rate limit exceeded. Please try again later.');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchNetworkError()
      );

      await expect(client.searchGifs('gachimuchi', 8))
        .rejects.toThrow('Network error. Please check your connection.');
    });

    it('should include pagination token when provided', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      await client.searchGifs('gachimuchi', 8, 'next-token');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('pos=next-token'),
        expect.any(Object)
      );
    });

    it('should use default limit when not provided', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      await client.searchGifs('gachimuchi');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=8'),
        expect.any(Object)
      );
    });
  });

  describe('getTrending', () => {
    it('should get trending GIFs successfully', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      const result = await client.getTrending(8);

      expect(result.results).toHaveLength(3);
      expect(result.next).toBe('next-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('g.tenor.com/v1/trending'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle trending API errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch({}, false, 404)
      );

      await expect(client.getTrending(8))
        .rejects.toThrow('HTTP error! status: 404');
    });
  });
});
