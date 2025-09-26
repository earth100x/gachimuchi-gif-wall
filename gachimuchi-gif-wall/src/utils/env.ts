/**
 * Environment variable validation and access utilities
 */

/**
 * Get required environment variable
 * @param key - Environment variable key
 * @returns Environment variable value
 * @throws Error if variable is not set
 */
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};

/**
 * Get optional environment variable with default value
 * @param key - Environment variable key
 * @param defaultValue - Default value if variable is not set
 * @returns Environment variable value or default
 */
export const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Get numeric environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if variable is not set or invalid
 * @returns Numeric value
 */
export const getNumericEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Validate Tenor API configuration
 * @returns Object with validated configuration
 * @throws Error if required configuration is missing
 */
export const validateTenorConfig = () => {
  const apiKey = getRequiredEnv('NEXT_PUBLIC_TENOR_API_KEY');
  const baseURL = getOptionalEnv('NEXT_PUBLIC_TENOR_API_BASE_URL', 'https://g.tenor.com/v1');
  const defaultLimit = getNumericEnv('NEXT_PUBLIC_TENOR_DEFAULT_LIMIT', 8);

  if (!apiKey || apiKey === 'your_tenor_api_key_here') {
    throw new Error('NEXT_PUBLIC_TENOR_API_KEY must be set to a valid Tenor API key');
  }

  return {
    apiKey,
    baseURL,
    defaultLimit
  };
};
