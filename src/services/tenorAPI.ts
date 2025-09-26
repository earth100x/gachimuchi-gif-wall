import { TenorResponse } from '../types';

/**
 * Tenor API Client
 * Handles communication with the Tenor API for fetching GIFs
 */
export class TenorAPIClient {
  private baseURL = 'https://tenor.googleapis.com/v2';
  private apiKey: string;
  private clientKey: string;
  private country: string;

  constructor(apiKey: string, clientKey: string = 'kazuya-demo', country: string = 'US') {
    this.apiKey = apiKey;
    this.clientKey = clientKey;
    this.country = country;
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
        client_key: this.clientKey,
        country: this.country,
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
      
      // Transform Tenor API v2 response to our interface
      return {
        results: data.results?.map((item: unknown) => {
          const typedItem = item as {
            id: string;
            content_description?: string;
            media_formats?: {
              gif?: { url?: string; dims?: number[] };
              tinygif?: { url?: string };
            };
            created?: string;
          };
          return {
            id: typedItem.id,
            title: typedItem.content_description || 'Untitled GIF',
            url: typedItem.media_formats?.gif?.url || '',
            preview: typedItem.media_formats?.tinygif?.url || typedItem.media_formats?.gif?.url || '',
            dimensions: {
              width: typedItem.media_formats?.gif?.dims?.[0] || 0,
              height: typedItem.media_formats?.gif?.dims?.[1] || 0,
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
   * Get featured GIFs (replaces trending in v2)
   * @param limit - Maximum number of results (default: 8)
   * @returns Promise<TenorResponse>
   */
  async getFeatured(limit: number = 8): Promise<TenorResponse> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        client_key: this.clientKey,
        country: this.country,
        limit: limit.toString(),
        media_filter: 'gif',
        contentfilter: 'high'
      });

      const response = await fetch(`${this.baseURL}/featured?${params}`, {
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
            media_formats?: {
              gif?: { url?: string; dims?: number[] };
              tinygif?: { url?: string };
            };
            created?: string;
          };
          return {
            id: typedItem.id,
            title: typedItem.content_description || 'Untitled GIF',
            url: typedItem.media_formats?.gif?.url || '',
            preview: typedItem.media_formats?.tinygif?.url || typedItem.media_formats?.gif?.url || '',
            dimensions: {
              width: typedItem.media_formats?.gif?.dims?.[0] || 0,
              height: typedItem.media_formats?.gif?.dims?.[1] || 0,
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
 * @param clientKey - Client key for integration identification
 * @param country - Country code (default: US)
 * @returns TenorAPIClient instance
 */
export const createTenorAPIClient = (
  apiKey: string, 
  clientKey: string = 'kazuya-demo', 
  country: string = 'US'
): TenorAPIClient => {
  return new TenorAPIClient(apiKey, clientKey, country);
};
