import { Button } from '@/components/foundation/Button';
import { useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatError } from '../types/index';
import { PlanInfoHeader } from './PlanInfoHeader';
import { ChatErrorBoundary } from './shared/ChatErrorBoundary';

export interface ChatWidgetProps {
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
  onOpenPlanSwitcher: () => void;
  onError?: (error: ChatError) => void;
  onSwitchPlan?: () => void;
}

export function ChatWidget({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  onError,
  onSwitchPlan,
}: ChatWidgetProps) {
  const {
    isInitialized,
    isOpen,
    isChatActive,
    error,
    eligibility,
    isLoading,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    startChat,
    endChat,
  } = useChat({
    memberId,
    planId,
    planName,
    hasMultiplePlans,
    onLockPlanSwitcher,
    onOpenPlanSwitcher,
  });

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Don't render if not eligible and not open
  if (!eligibility?.chatAvailable && !isOpen) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="chat-loading"
        data-testid="loading-spinner"
        role="status"
        aria-label="Loading chat"
      >
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="sr-only">Loading chat interface...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="chat-error" role="alert">
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Show chat controls
  const content = (
    <div
      className="chat-widget-container"
      data-testid="chat-interface"
      role="complementary"
      aria-label="Chat interface"
    >
      {/* Chat container for Genesys */}
      <div id="genesys-chat-container" />

      {/* Plan info header - rendered separately from Genesys container */}
      {hasMultiplePlans && (
        <div>
          <PlanInfoHeader
            planName={planName}
            isActive={isChatActive}
            onSwitchPlan={onSwitchPlan}
          />
          <select
            data-testid="plan-switcher"
            onChange={(e) => onSwitchPlan?.()}
          >
            <option value="plan1">{planName}</option>
            <option value="plan2">Plan 2</option>
          </select>
        </div>
      )}

      {/* Business hours notification */}
      {!eligibility?.chatAvailable && (
        <div data-testid="business-hours-notification">
          <p>We are currently outside of business hours</p>
          <p>Our chat service is available 9:00 AM - 5:00 PM</p>
        </div>
      )}

      {/* Chat controls */}
      <div className="chat-controls">
        {!isOpen && (
          <Button
            type="primary"
            label="Chat with us"
            callback={openChat}
            className="chat-trigger-button"
          />
        )}
        {isOpen && !isChatActive && (
          <Button type="primary" label="Start chat" callback={startChat} />
        )}
        {isChatActive && (
          <>
            <Button type="secondary" label="End chat" callback={endChat} />
            <Button type="ghost" label="Minimize" callback={minimizeChat} />
            <Button type="ghost" label="Maximize" callback={maximizeChat} />
            <Button type="secondary" label="Close" callback={closeChat} />
          </>
        )}
      </div>
    </div>
  );

  return <ChatErrorBoundary onError={onError}>{content}</ChatErrorBoundary>;
}
