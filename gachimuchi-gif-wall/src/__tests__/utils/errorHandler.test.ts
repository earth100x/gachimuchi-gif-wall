import {
  getUserFriendlyError,
  isRetryableError,
  retryWithBackoff,
  handleAPIError,
  createErrorBoundaryError
} from '../../utils/errorHandler';

describe('errorHandler', () => {
  describe('getUserFriendlyError', () => {
    it('should return user-friendly message for known errors', () => {
      expect(getUserFriendlyError('Rate limit exceeded')).toBe(
        'Too many requests. Please wait a moment and try again.'
      );
      expect(getUserFriendlyError('Network error')).toBe(
        'Unable to connect. Please check your internet connection.'
      );
    });

    it('should return original message for unknown errors', () => {
      const unknownError = 'Unknown error message';
      expect(getUserFriendlyError(unknownError)).toBe(unknownError);
    });

    it('should handle Error objects', () => {
      const error = new Error('HTTP error! status: 500');
      expect(getUserFriendlyError(error)).toBe(
        'Server error. Please try again later.'
      );
    });

    it('should handle non-string, non-Error values', () => {
      expect(getUserFriendlyError(null)).toBe(
        'An unexpected error occurred. Please try again.'
      );
      expect(getUserFriendlyError(undefined)).toBe(
        'An unexpected error occurred. Please try again.'
      );
      expect(getUserFriendlyError(123)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      expect(isRetryableError(new Error('Network error'))).toBe(true);
      expect(isRetryableError(new Error('HTTP error! status: 500'))).toBe(true);
      expect(isRetryableError(new Error('timeout'))).toBe(true);
      expect(isRetryableError(new Error('ECONNRESET'))).toBe(true);
      expect(isRetryableError(new Error('ENOTFOUND'))).toBe(true);
    });

    it('should identify non-retryable errors', () => {
      expect(isRetryableError(new Error('HTTP error! status: 400'))).toBe(false);
      expect(isRetryableError(new Error('Invalid API key'))).toBe(false);
      expect(isRetryableError(new Error('Validation error'))).toBe(false);
    });

    it('should handle non-Error values', () => {
      expect(isRetryableError('string error')).toBe(false);
      expect(isRetryableError(null)).toBe(false);
      expect(isRetryableError(undefined)).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await retryWithBackoff(mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValue('success');
      
      const result = await retryWithBackoff(mockFn, 3, 10);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Invalid API key'));
      
      await expect(retryWithBackoff(mockFn)).rejects.toThrow('Invalid API key');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throw final error after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(retryWithBackoff(mockFn, 2, 10)).rejects.toThrow('Network error');
      expect(mockFn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('should respect delay between retries', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const startTime = Date.now();
      await retryWithBackoff(mockFn, 1, 100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('handleAPIError', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log error and return user-friendly message', () => {
      const error = new Error('HTTP error! status: 500');
      const context = 'searchGifs';
      
      const result = handleAPIError(error, context);
      
      expect(result).toBe('Server error. Please try again later.');
      expect(consoleSpy).toHaveBeenCalledWith('API Error in searchGifs:', error);
    });

    it('should log additional context in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      const context = 'testContext';
      
      handleAPIError(error, context);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error context:', context);
      expect(consoleSpy).toHaveBeenCalledWith('Full error:', error);
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('createErrorBoundaryError', () => {
    it('should create formatted error object', () => {
      const error = new Error('Component error');
      const errorInfo = {
        componentStack: 'Component stack trace'
      };
      
      const result = createErrorBoundaryError(error, errorInfo);
      
      expect(result.message).toBe('Component error');
      expect(result.originalError).toBe('Component error');
      expect(result.stack).toBe(error.stack);
      expect(result.componentStack).toBe('Component stack trace');
      expect(result.timestamp).toBeDefined();
    });

    it('should use user-friendly message for known errors', () => {
      const error = new Error('HTTP error! status: 500');
      const errorInfo = { componentStack: '' };
      
      const result = createErrorBoundaryError(error, errorInfo);
      
      expect(result.message).toBe('Server error. Please try again later.');
      expect(result.originalError).toBe('HTTP error! status: 500');
    });
  });
});
