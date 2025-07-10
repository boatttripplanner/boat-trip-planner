import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md'; // sm for small (e.g., 20x20), md for default (48x48)
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'h-5 w-5 border-t-2 border-b-2' : 'h-12 w-12 border-t-4 border-b-4';
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-teal-600 ${sizeClasses}`}></div>
    </div>
  );
};
