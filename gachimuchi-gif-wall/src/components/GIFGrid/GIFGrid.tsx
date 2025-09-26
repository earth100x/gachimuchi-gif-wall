import React from 'react';
import { GIF } from '../../types';
import { GIFItem } from '../GIFItem';
import { LoadingSpinner } from '../LoadingSpinner';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface GIFGridProps {
  gifs: GIF[];
  loading?: boolean;
  hasMore?: boolean;
  onGifClick?: (gif: GIF) => void;
  onLoadMore?: () => void;
}

export const GIFGrid: React.FC<GIFGridProps> = ({
  gifs,
  loading = false,
  hasMore = false,
  onGifClick,
  onLoadMore
}) => {
  const { targetRef } = useInfiniteScroll(
    onLoadMore || (() => {}),
    {
      enabled: hasMore && !loading,
      rootMargin: '0px 0px 200px 0px',
      delayInMs: 200, // Increased delay to prevent rapid calls
    }
  );

  return (
    <div className="gif-grid-container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {gifs.map((gif) => (
          <GIFItem 
            key={gif.id} 
            gif={gif} 
            onClick={onGifClick}
          />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      )}
      
      {!loading && gifs.length === 0 && (
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-400 text-lg">No GIFs found</p>
        </div>
      )}

      {/* Infinite scroll trigger element */}
      {hasMore && !loading && (
        <div 
          ref={targetRef} 
          data-testid="infinite-scroll-trigger"
          className="h-4 w-full"
          aria-label="Load more GIFs"
        />
      )}
    </div>
  );
};
