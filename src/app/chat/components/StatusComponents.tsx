'use client';

import { ReactNode } from 'react';

/**
 * Loading component for chat initialization
 */
export function ChatLoading() {
  return (
    <div className="chat-loading-container" aria-hidden="true">
      {/* No visible UI needed for loading */}
    </div>
  );
}

/**
 * Business hours banner component
 */
export function BusinessHoursBanner({ 
  isOpen, 
  hours 
}: { 
  isOpen: boolean; 
  hours?: string 
}) {
  if (!hours) return null;
  
  return (
    <div className={`business-hours-banner ${isOpen ? 'open' : 'closed'}`}>
      <span>{isOpen ? 'We are currently open' : 'Currently closed'}</span>
      <span className="hours">{hours}</span>
    </div>
  );
}

/**
 * Generic status message component
 */
export function ChatStatus({ 
  type, 
  children 
}: { 
  type: 'info' | 'warning' | 'error'; 
  children: ReactNode 
}) {
  return <div className={`chat-status chat-status-${type}`}>{children}</div>;
}