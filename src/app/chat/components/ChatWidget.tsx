import React, { Component, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatError, ChatErrorCode } from '../types';
import { PlanInfoHeader } from './PlanInfoHeader';

// Error Boundary Component
class ChatErrorBoundary extends Component<
  { children: React.ReactNode; onError?: (error: ChatError) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    onError?: (error: ChatError) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): {
    hasError: boolean;
    error: Error | null;
  } {
    return {
      hasError: true,
      error:
        error instanceof ChatError
          ? error
          : new ChatError(
              'An unexpected error occurred',
              'INITIALIZATION_ERROR' as ChatErrorCode,
            ),
    };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(new ChatError(error.message, 'INITIALIZATION_ERROR'));
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Chat will be hidden on error
    }
    return this.props.children;
  }
}

interface ChatWidgetProps {
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
  onOpenPlanSwitcher: () => void;
  onError?: (error: ChatError) => void;
}

export function ChatWidget({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  onError,
}: ChatWidgetProps) {
  const {
    isInitialized,
    isOpen,
    isChatActive,
    error,
    eligibility,
    isLoading,
    openChat,
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
      <div className="chat-loading" role="status" aria-label="Loading chat">
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

  return (
    <ChatErrorBoundary onError={onError}>
      <div
        className="chat-widget-container"
        role="complementary"
        aria-label="Chat interface"
      >
        {/* Chat container for Genesys */}
        <div id="genesys-chat-container" />

        {/* Plan info header - rendered separately from Genesys container */}
        {hasMultiplePlans && (
          <PlanInfoHeader
            planName={planName}
            isActive={isChatActive}
            onSwitchPlan={onOpenPlanSwitcher}
          />
        )}

        {/* Chat button - only show when chat is not open */}
        {!isOpen && isInitialized && (
          <button
            onClick={openChat}
            className="chat-button fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Start chat"
          >
            <svg
              className="w-6 h-6 m-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        )}
      </div>
    </ChatErrorBoundary>
  );
}
