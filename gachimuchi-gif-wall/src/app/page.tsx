'use client';

import React, { useEffect } from 'react';
import { GIFGrid } from '../components/GIFGrid';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { useTenorAPI } from '../hooks/useTenorAPI';
import { validateTenorConfig } from '../utils/env';
import { GIF } from '../types';

export default function Home() {
  const [configError, setConfigError] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState<string>('');

  // Initialize config
  React.useEffect(() => {
    try {
      const validatedConfig = validateTenorConfig();
      setApiKey(validatedConfig.apiKey);
      setConfigError(null);
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Configuration error');
    }
  }, []);

  // Always call the hook, but with empty key if not available
  const { gifs, loading, error, searchGifs, retry } = useTenorAPI(apiKey);
  const finalError = configError || error;

  // Initial load on component mount
  useEffect(() => {
    if (apiKey && searchGifs) {
      searchGifs('gachimuchi');
    }
  }, [apiKey, searchGifs]);

  const handleGifClick = (gif: GIF) => {
    // Future modal functionality
    console.log('GIF clicked:', gif);
  };

  const handleRetry = () => {
    retry('gachimuchi');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Gachimuchi GIF Wall
          </h1>
          <p className="text-gray-300 text-lg">
            An infinite scrolling collection of GIFs powered by Tenor API
          </p>
        </div>

        {finalError ? (
          <ErrorDisplay 
            error={finalError} 
            onRetry={handleRetry}
            retryLabel="Try Again"
          />
        ) : (
          <GIFGrid 
            gifs={gifs}
            loading={loading}
            onGifClick={handleGifClick}
          />
        )}
      </div>
    </div>
  );
}
