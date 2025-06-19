import React from 'react';

interface LoadingSpinnerProps {
  size?: string; 
  color?: string; 
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'h-8 w-8',
  color = 'text-primary',
}) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-r-2 border-transparent ${color}`} role="status">
      <span className="sr-only">Memuat...</span>
    </div>
  );
};

export default LoadingSpinner;