'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'inline' | 'overlay';
  isTransparent?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'inline',
  isTransparent = false,
}) => {
  if (variant === 'overlay') {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          isTransparent ? 'bg-black/20' : 'bg-white'
        }`}
      >
        <div className="text-center">
          <LoadingSpinner size="large" />
          {message && <p className="mt-4 text-gray-600">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-2">
      <LoadingSpinner size={size} />
      {message && <span className="text-neutral text-sm">{message}</span>}
    </div>
  );
};

// Re-export LoadingOverlay for backward compatibility
export const LoadingOverlay: React.FC<Omit<LoadingStateProps, 'variant'>> = (
  props,
) => <LoadingState {...props} variant="overlay" />;
