import { GIF, TenorResponse, TenorSearchParams, TenorError } from '../types';

describe('Type Definitions', () => {
  describe('GIF interface', () => {
    it('should accept valid GIF object', () => {
      const gif: GIF = {
        id: 'test-id',
        title: 'Test GIF',
        url: 'https://example.com/test.gif',
        preview: 'https://example.com/preview.gif',
        dimensions: {
          width: 480,
          height: 270
        },
        created: '2025-01-12T10:00:00Z'
      };

      expect(gif.id).toBe('test-id');
      expect(gif.dimensions.width).toBe(480);
    });
  });

  describe('TenorResponse interface', () => {
    it('should accept valid TenorResponse object', () => {
      const response: TenorResponse = {
        results: [],
        next: 'next-token'
      };

      expect(response.results).toEqual([]);
      expect(response.next).toBe('next-token');
    });

    it('should accept TenorResponse with error', () => {
      const response: TenorResponse = {
        results: [],
        error: 'API error'
      };

      expect(response.error).toBe('API error');
    });
  });

  describe('TenorSearchParams interface', () => {
    it('should accept valid search parameters', () => {
      const params: TenorSearchParams = {
        query: 'gachimuchi',
        limit: 8,
        pos: 'next-token'
      };

      expect(params.query).toBe('gachimuchi');
      expect(params.limit).toBe(8);
    });
  });

  describe('TenorError interface', () => {
    it('should accept valid error object', () => {
      const error: TenorError = {
        error: 'Rate limit exceeded',
        code: 429,
        details: 'Too many requests'
      };

      expect(error.error).toBe('Rate limit exceeded');
      expect(error.code).toBe(429);
    });
  });
});
