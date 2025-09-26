import { TenorResponse, GIF } from '../types';

/**
 * Mock data for Tenor API testing
 */

export const mockGIF: GIF = {
  id: 'mock-gif-1',
  title: 'Mock GIF',
  url: 'https://media.tenor.com/images/1234567890abcdef/mock.gif',
  preview: 'https://media.tenor.com/images/1234567890abcdef/mock-preview.gif',
  dimensions: {
    width: 480,
    height: 270
  },
  created: '2025-01-12T10:00:00Z'
};

export const mockGIFs: GIF[] = [
  mockGIF,
  {
    id: 'mock-gif-2',
    title: 'Another Mock GIF',
    url: 'https://media.tenor.com/images/2345678901bcdefg/mock2.gif',
    preview: 'https://media.tenor.com/images/2345678901bcdefg/mock2-preview.gif',
    dimensions: {
      width: 320,
      height: 240
    },
    created: '2025-01-12T11:00:00Z'
  },
  {
    id: 'mock-gif-3',
    title: 'Third Mock GIF',
    url: 'https://media.tenor.com/images/3456789012cdefgh/mock3.gif',
    preview: 'https://media.tenor.com/images/3456789012cdefgh/mock3-preview.gif',
    dimensions: {
      width: 640,
      height: 480
    },
    created: '2025-01-12T12:00:00Z'
  }
];

// Mock Tenor API response structure
export const mockTenorAPIData = {
  results: [
    {
      id: 'mock-gif-1',
      content_description: 'Mock GIF',
      media: [{
        gif: {
          url: 'https://media.tenor.com/images/1234567890abcdef/mock.gif',
          dims: [480, 270]
        },
        tinygif: {
          url: 'https://media.tenor.com/images/1234567890abcdef/mock-preview.gif'
        }
      }],
      created: '2025-01-12T10:00:00Z'
    },
    {
      id: 'mock-gif-2',
      content_description: 'Another Mock GIF',
      media: [{
        gif: {
          url: 'https://media.tenor.com/images/2345678901bcdefg/mock2.gif',
          dims: [320, 240]
        },
        tinygif: {
          url: 'https://media.tenor.com/images/2345678901bcdefg/mock2-preview.gif'
        }
      }],
      created: '2025-01-12T11:00:00Z'
    },
    {
      id: 'mock-gif-3',
      content_description: 'Third Mock GIF',
      media: [{
        gif: {
          url: 'https://media.tenor.com/images/3456789012cdefgh/mock3.gif',
          dims: [640, 480]
        },
        tinygif: {
          url: 'https://media.tenor.com/images/3456789012cdefgh/mock3-preview.gif'
        }
      }],
      created: '2025-01-12T12:00:00Z'
    }
  ],
  next: 'next-token-123'
};

export const mockTenorResponse: TenorResponse = {
  results: mockGIFs,
  next: 'next-token-123'
};

export const mockTenorResponseWithError: TenorResponse = {
  results: [],
  error: 'API rate limit exceeded'
};

export const mockTenorResponseEmpty: TenorResponse = {
  results: [],
  next: undefined
};

/**
 * Mock fetch function for testing
 */
export const mockFetch = (response: unknown, ok: boolean = true, status: number = 200) => {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(response)
  });
};

/**
 * Mock fetch function that throws an error
 */
export const mockFetchError = (error: Error) => {
  return jest.fn().mockRejectedValue(error);
};

/**
 * Mock fetch function for network error
 */
export const mockFetchNetworkError = () => {
  return jest.fn().mockRejectedValue(new TypeError('Network error'));
};

/**
 * Mock fetch function for rate limit error
 */
export const mockFetchRateLimit = () => {
  return jest.fn().mockResolvedValue({
    ok: false,
    status: 429,
    json: jest.fn().mockResolvedValue({ error: 'Rate limit exceeded' })
  });
};
