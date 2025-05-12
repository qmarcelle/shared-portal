import React from 'react';

interface SpacerProps {
  size: number;
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ size, className = '' }) => {
  return <div style={{ height: `${size}px` }} className={className} />;
};