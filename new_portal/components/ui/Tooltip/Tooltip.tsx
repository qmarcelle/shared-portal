import React, { ReactNode } from 'react';

interface ToolTipProps {
  children: ReactNode;
  label: string;
  showTooltip: boolean;
  className?: string;
}

export const ToolTip: React.FC<ToolTipProps> = ({
  children,
  label,
  showTooltip,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-full">
          <div className="bg-gray-800 text-white text-sm rounded py-1 px-2">
            {label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};