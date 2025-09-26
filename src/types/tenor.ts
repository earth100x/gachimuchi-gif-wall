import { GIF } from './gif';

/**
 * Tenor API response interface
 * Represents the response structure from Tenor API search endpoint
 */
export interface TenorResponse {
  results: GIF[];
  next?: string;
  error?: string;
}

/**
 * Tenor API search parameters
 */
export interface TenorSearchParams {
  query: string;
  limit?: number;
  pos?: string;
}

/**
 * Tenor API error response
 */
export interface TenorError {
  error: string;
  code?: number;
  details?: string;
}
