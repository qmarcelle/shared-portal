import { Button } from '@/components/foundation/Button';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { env } from '../config/env';
import { useChatEligibility } from '../hooks';
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
}

export function ChatWidget({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  _onError,
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
  } = useChatEligibility(memberId, planId);

  // Initialize chat when config is ready
  useEffect(() => {
    if (chatConfig && !isInitialized) {
      startChat();
    }
  }, [chatConfig, isInitialized, startChat]);

  // Don't render if no config or not eligible
  if (!chatConfig || (!eligibility?.isEligible && !isOpen)) {
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

  const content = (
    <>
      <GenesysScripts
        deploymentId={env.genesys.deploymentId}
        environment={env.genesys.region}
        orgId={env.genesys.orgId}
      />
      <div
        className="chat-widget-container"
        data-testid="chat-interface"
        role="complementary"
        aria-label="Chat interface"
      >
        {/* Chat container for Genesys */}
        <div id="genesys-chat-container" />

        {/* Plan info header */}
        {hasMultiplePlans && (
          <PlanInfoHeader
            planName={planName}
            isActive={isChatActive}
            onSwitchPlan={onOpenPlanSwitcher}
          />
        )}

        {/* Business hours notification */}
        {!eligibility?.isEligible && (
          <div data-testid="business-hours-notification">
            <p>We are currently outside of business hours</p>
            <p>Our chat service is available 9:00 AM - 5:00 PM</p>
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
    </>
  );

  return (
    <ChatErrorBoundary onError={(err) => console.error(err)}>
      {content}
    </ChatErrorBoundary>
  );
}
