import React from 'react';

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return <hr className={`border-t border-gray-300 w-full ${className}`} />;
};