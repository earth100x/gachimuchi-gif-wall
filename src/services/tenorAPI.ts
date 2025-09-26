import { TenorResponse } from '../types';

/**
 * Tenor API Client
 * Handles communication with the Tenor API for fetching GIFs
 */
export class TenorAPIClient {
  private baseURL = 'https://g.tenor.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for GIFs using the Tenor API
   * @param query - Search query string
   * @param limit - Maximum number of results (default: 8)
   * @param pos - Position token for pagination
   * @returns Promise<TenorResponse>
   */
  async searchGifs(
    query: string,
    limit: number = 8,
    pos?: string
  ): Promise<TenorResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        key: this.apiKey,
        limit: limit.toString(),
        media_filter: 'gif',
        contentfilter: 'high'
      });

      if (pos) {
        params.append('pos', pos);
      }

      const response = await fetch(`${this.baseURL}/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform Tenor API response to our interface
      return {
        results: data.results?.map((item: unknown) => {
          const typedItem = item as {
            id: string;
            content_description?: string;
            media?: Array<{
              gif?: { url?: string; dims?: number[] };
              tinygif?: { url?: string };
            }>;
            created?: string;
          };
          return {
            id: typedItem.id,
            title: typedItem.content_description || 'Untitled GIF',
            url: typedItem.media?.[0]?.gif?.url || '',
            preview: typedItem.media?.[0]?.tinygif?.url || typedItem.media?.[0]?.gif?.url || '',
            dimensions: {
              width: typedItem.media?.[0]?.gif?.dims?.[0] || 0,
              height: typedItem.media?.[0]?.gif?.dims?.[1] || 0,
            },
            created: typedItem.created || new Date().toISOString(),
          };
        }) || [],
        next: data.next,
        error: data.error
      };
    } catch (error) {
      console.error('Tenor API Error:', error);
      
      // Handle rate limiting with exponential backoff
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      // Handle network errors
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get trending GIFs
   * @param limit - Maximum number of results (default: 8)
   * @returns Promise<TenorResponse>
   */
  async getTrending(limit: number = 8): Promise<TenorResponse> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        limit: limit.toString(),
        media_filter: 'gif',
        contentfilter: 'high'
      });

      const response = await fetch(`${this.baseURL}/trending?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        results: data.results?.map((item: unknown) => {
          const typedItem = item as {
            id: string;
            content_description?: string;
            media?: Array<{
              gif?: { url?: string; dims?: number[] };
              tinygif?: { url?: string };
            }>;
            created?: string;
          };
          return {
            id: typedItem.id,
            title: typedItem.content_description || 'Untitled GIF',
            url: typedItem.media?.[0]?.gif?.url || '',
            preview: typedItem.media?.[0]?.tinygif?.url || typedItem.media?.[0]?.gif?.url || '',
            dimensions: {
              width: typedItem.media?.[0]?.gif?.dims?.[0] || 0,
              height: typedItem.media?.[0]?.gif?.dims?.[1] || 0,
            },
            created: typedItem.created || new Date().toISOString(),
          };
        }) || [],
        next: data.next,
        error: data.error
      };
    } catch (error) {
      console.error('Tenor API Error:', error);
      throw error;
    }
  }
}

/**
 * Create a new Tenor API client instance
 * @param apiKey - Tenor API key
 * @returns TenorAPIClient instance
 */
export const createTenorAPIClient = (apiKey: string): TenorAPIClient => {
  return new TenorAPIClient(apiKey);
};
