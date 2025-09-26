import React from 'react';
import Image from 'next/image';
import { GIF } from '../../types';

interface GIFItemProps {
  gif: GIF;
  onClick?: (gif: GIF) => void;
}

export const GIFItem: React.FC<GIFItemProps> = ({ gif, onClick }) => {
  const handleClick = () => {
    onClick?.(gif);
  };

  return (
    <div 
      className="gif-item cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg overflow-hidden bg-gray-800"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View GIF: ${gif.title}`}
      data-testid="gif-item"
    >
      <Image
        src={gif.preview}
        alt={gif.title}
        width={gif.dimensions.width}
        height={gif.dimensions.height}
        className="w-full h-auto object-cover"
        style={{
          aspectRatio: `${gif.dimensions.width} / ${gif.dimensions.height}`
        }}
      />
    </div>
  );
};
