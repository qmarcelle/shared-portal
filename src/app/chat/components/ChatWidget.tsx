import { reloadPage } from '@/utils/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useChat } from '../hooks';
import { ChatTrigger } from './ChatTrigger';
import { GenesysScripts } from './GenesysScripts';
import { PlanInfoHeader } from './PlanInfoHeader';
import { ChatErrorBoundary } from './shared/ChatErrorBoundary';

export interface ChatWidgetProps {
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
  onOpenPlanSwitcher: () => void;
  _onError?: (error: Error) => void;
  forceCloudChat?: boolean; // New prop to control chat mode
}

export function ChatWidget({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  _onError,
  forceCloudChat = true, // Default to true to force cloud chat for testing
}: ChatWidgetProps) {
  const _session = useSession();

  const chatConfig = useMemo(
    () => ({
      memberId,
      planId,
      planName,
      hasMultiplePlans,
      onLockPlanSwitcher,
      onOpenPlanSwitcher,
    }),
    [
      memberId,
      planId,
      planName,
      hasMultiplePlans,
      onLockPlanSwitcher,
      onOpenPlanSwitcher,
    ],
  );

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
  });

  // Initialize chat when config is ready
  useEffect(() => {
    if (chatConfig && !isInitialized) {
      startChat();
    }
  }, [chatConfig, isInitialized, startChat]);

  // Don't render if no config or not eligible
  if (!chatConfig || (!eligibility?.chatAvailable && !isOpen)) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="fixed bottom-8 right-8 flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-soft"
        data-testid="loading-spinner"
        role="status"
        aria-label="Loading chat"
      >
        <svg
          className="animate-spin h-8 w-8 text-primary-content"
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
      <div
        className="fixed bottom-8 right-8 p-4 bg-error text-error-content rounded-lg shadow-soft"
        role="alert"
      >
        <p className="font-medium">{error.message}</p>
        <button
          onClick={() => reloadPage()}
          className="mt-2 px-4 py-2 bg-error-content text-error rounded hover:bg-opacity-90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const content = (
    <>
      <GenesysScripts
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
        environment={process.env.NEXT_PUBLIC_GENESYS_REGION || 'us-east-1'}
        orgId={process.env.NEXT_PUBLIC_GENESYS_ORG_ID || ''}
        memberId={memberId}
        planId={planId}
        forceCloudChat={forceCloudChat} // Pass the prop to force cloud chat
      />
      <div
        className="chat-widget-container"
        data-testid="chat-interface"
        role="complementary"
        aria-label="Chat interface"
      >
        {/* Chat container for Genesys */}
        <div id="genesys-chat-container" className="w-full h-full" />

        {/* Plan info header */}
        {hasMultiplePlans && (
          <PlanInfoHeader
            planName={planName}
            isActive={isChatActive}
            onOpenPlanSwitcher={onOpenPlanSwitcher}
          />
        )}

        {/* Business hours notification */}
        {!eligibility?.chatAvailable && (
          <div
            className="p-4 bg-warning/10 text-warning rounded-lg text-center"
            data-testid="business-hours-notification"
          >
            <p className="font-medium">
              We are currently outside of business hours
            </p>
            <p className="mt-1 text-sm">
              Our chat service is available 9:00 AM - 5:00 PM
            </p>
          </div>
        )}

        {/* Chat controls */}
        <div className="chat-controls">
          {!isOpen && (
            <ChatTrigger
              onOpen={openChat}
              fixed={false}
              className="chat-trigger-button"
              testId="button-chat-with-us"
              _label="Chat with us"
            />
          )}
          {isOpen && !isChatActive && (
            <button
              type="button"
              onClick={startChat}
              className="chat-button chat-button-primary"
            >
              Start chat
            </button>
          )}
          {isChatActive && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={endChat}
                className="chat-button chat-button-secondary"
              >
                End chat
              </button>
              <button
                type="button"
                onClick={minimizeChat}
                className="chat-button bg-base-200 text-neutral hover:bg-base-300"
              >
                Minimize
              </button>
              <button
                type="button"
                onClick={maximizeChat}
                className="chat-button bg-base-200 text-neutral hover:bg-base-300"
              >
                Maximize
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="chat-button chat-button-secondary"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <ChatErrorBoundary onError={(err) => console.error(err)}>
      {content}
    </ChatErrorBoundary>
  );
}
