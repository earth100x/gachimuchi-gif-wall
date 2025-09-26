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
  const mockClientKey = 'test-client-key';
  const mockCountry = 'US';

  beforeEach(() => {
    client = new TenorAPIClient(mockApiKey, mockClientKey, mockCountry);
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
        expect.stringContaining('tenor.googleapis.com/v2/search'),
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

    it('should include required v2 parameters', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      await client.searchGifs('gachimuchi', 8);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(fetchCall).toContain('client_key=test-client-key');
      expect(fetchCall).toContain('country=US');
      expect(fetchCall).toContain('key=test-api-key');
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

  describe('getFeatured', () => {
    it('should get featured GIFs successfully (replaces trending in v2)', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      const result = await client.getFeatured(8);

      expect(result.results).toHaveLength(3);
      expect(result.next).toBe('next-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tenor.googleapis.com/v2/featured'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should include required v2 parameters for featured endpoint', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch(mockTenorAPIData)
      );

      await client.getFeatured(8);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(fetchCall).toContain('client_key=test-client-key');
      expect(fetchCall).toContain('country=US');
      expect(fetchCall).toContain('key=test-api-key');
    });

    it('should handle featured API errors', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        mockFetch({}, false, 404)
      );

      await expect(client.getFeatured(8))
        .rejects.toThrow('HTTP error! status: 404');
    });
  });
});
