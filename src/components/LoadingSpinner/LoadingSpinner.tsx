import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div 
      className="flex items-center justify-center"
      role="status"
      aria-label="Loading GIFs"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
