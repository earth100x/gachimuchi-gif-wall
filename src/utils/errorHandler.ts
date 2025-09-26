/**
 * Error handling utilities for the application
 */

/**
 * User-friendly error message mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  'Rate limit exceeded': 'Too many requests. Please wait a moment and try again.',
  'Network error': 'Unable to connect. Please check your internet connection.',
  'HTTP error! status: 401': 'Invalid API key. Please check your configuration.',
  'HTTP error! status: 403': 'Access forbidden. Please check your API permissions.',
  'HTTP error! status: 404': 'Service not found. Please try again later.',
  'HTTP error! status: 429': 'Too many requests. Please wait and try again.',
  'HTTP error! status: 500': 'Server error. Please try again later.',
  'HTTP error! status: 503': 'Service unavailable. Please try again later.',
};

/**
 * Get user-friendly error message
 * @param error - Error object or message
 * @returns User-friendly error message
 */
export const getUserFriendlyError = (error: unknown): string => {
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  if (error instanceof Error) {
    // Check for specific error messages
    for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
      if (error.message.includes(key)) {
        return message;
      }
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is retryable
 * @param error - Error object
 * @returns True if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const retryablePatterns = [
      'Network error',
      'HTTP error! status: 5',
      'timeout',
      'ECONNRESET',
      'ENOTFOUND'
    ];

    return retryablePatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  return false;
};

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise with result or final error
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Handle API errors with proper logging and user feedback
 * @param error - Error object
 * @param context - Context where error occurred
 * @returns User-friendly error message
 */
export const handleAPIError = (error: unknown, context: string): string => {
  console.error(`API Error in ${context}:`, error);
  
  const userMessage = getUserFriendlyError(error);
  
  // Log additional context for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error context:', context);
    console.error('Full error:', error);
  }

  return userMessage;
};

/**
 * Create error boundary error object
 * @param error - Original error
 * @param errorInfo - Error info from React error boundary
 * @returns Formatted error object
 */
export const createErrorBoundaryError = (error: Error, errorInfo: { componentStack?: string }) => {
  return {
    message: getUserFriendlyError(error),
    originalError: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString()
  };
};
