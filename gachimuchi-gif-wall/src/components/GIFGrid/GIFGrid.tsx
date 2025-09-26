import React from 'react';
import { GIF } from '../../types';
import { GIFItem } from '../GIFItem';
import { LoadingSpinner } from '../LoadingSpinner';

interface GIFGridProps {
  gifs: GIF[];
  loading?: boolean;
  onGifClick?: (gif: GIF) => void;
}

export const GIFGrid: React.FC<GIFGridProps> = ({
  gifs,
  loading = false,
  onGifClick
}) => {
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
    </div>
  );
};
