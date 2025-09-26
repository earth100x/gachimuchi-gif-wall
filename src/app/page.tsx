'use client';

import React, { useEffect } from 'react';
import { GIFGrid } from '../components/GIFGrid';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { useTenorAPI } from '../hooks/useTenorAPI';
import { GIF } from '../types';

export default function Home() {
  const [configError, setConfigError] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState<string>('');

  // Initialize config - use direct access to environment variables
  React.useEffect(() => {
    try {
      const envApiKey = process.env.NEXT_PUBLIC_TENOR_API_KEY;
      if (!envApiKey || envApiKey === 'your_tenor_api_key_here') {
        throw new Error('NEXT_PUBLIC_TENOR_API_KEY must be set to a valid Tenor API key');
      }
      setApiKey(envApiKey);
      setConfigError(null);
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Configuration error');
    }
  }, []);

  // Always call the hook, but with empty key if not available
  const { gifs, loading, error, hasMore, searchGifs, loadMoreGifs, retry } = useTenorAPI(apiKey);
  const finalError = configError || error;

  // Initial load on component mount
  useEffect(() => {
    if (apiKey && searchGifs) {
      searchGifs('gachimuchi');
    }
  }, [apiKey]); // Remove searchGifs from dependencies to prevent re-triggering

  const handleGifClick = (gif: GIF) => {
    // Future modal functionality
    console.log('GIF clicked:', gif);
  };

  const handleRetry = () => {
    retry('gachimuchi');
  };

  const handleLoadMore = () => {
    if (apiKey && loadMoreGifs) {
      loadMoreGifs('gachimuchi');
    }
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
            hasMore={hasMore}
            onGifClick={handleGifClick}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
}
