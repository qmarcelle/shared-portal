'use client';

import { useEffect } from 'react';
import { useChatState, useChatUI } from '../../stores/chatStore';
import { BusinessHoursDisplay } from '../features/business-hours/BusinessHoursDisplay';
import { PlanSwitcher } from '../features/plan-switcher/PlanSwitcher';
import { ChatErrorBoundary } from '../shared/ChatErrorBoundary';
import { LoadingState } from '../shared/LoadingState';
import { ChatControls } from './ChatControls';
import { ChatWidget } from './ChatWidget';

export interface ChatContainerProps {
  isCloudEligible?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  isCloudEligible = false,
}) => {
  const { isOpen, isLoading, theme } = useChatUI();
  const { error, currentPlan } = useChatState();

  useEffect(() => {
    // Add theme class to body
    document.body.classList.toggle('theme-dark', theme === 'dark');
    return () => {
      document.body.classList.remove('theme-dark');
    };
  }, [theme]);

  if (!isOpen) return null;

  return (
    <ChatErrorBoundary>
      <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] bg-base-100 rounded-t-lg md:rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <BusinessHoursDisplay />
          <ChatControls />
        </div>

        {isLoading ? (
          <LoadingState message="Initializing chat..." />
        ) : error ? (
          <div className="p-4 text-error">{error.message}</div>
        ) : (
          <>
            {currentPlan && <PlanSwitcher />}
            <ChatWidget isCloudEligible={isCloudEligible} />
          </>
        )}
      </div>
    </ChatErrorBoundary>
  );
};
