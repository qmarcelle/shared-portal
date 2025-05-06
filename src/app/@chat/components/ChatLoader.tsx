'use client';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import BusinessHoursBanner from './BusinessHoursBanner';
import ChatControls from './ChatControls';
import { ChatPersistence } from './ChatPersistence';
import ChatSession from './ChatSession';
import { ChatWidget } from './ChatWidget';
import CloudChatWrapper from './CloudChatWrapper';
import LegacyChatWrapper from './LegacyChatWrapper';
import PlanInfoHeader from './PlanInfoHeader';
import PlanSwitcherButton from './PlanSwitcherButton';
import TermsAndConditions from './TermsAndConditions';

interface ChatLoaderProps {
  memberId: number;
  planId: string;
  memberType?: string;
}

/**
 * Main chat loader component that:
 * - Loads chat configuration on mount
 * - Sets up chat event handlers
 * - Renders the appropriate chat UI based on state
 */
export default function ChatLoader({
  memberId,
  planId,
  memberType = 'byMemberCk',
}: ChatLoaderProps) {
  const {
    loadChatConfiguration,
    isChatActive,
    isEligible,
    isOOO,
    chatMode,
    isLoading,
    error,
  } = useChatStore();

  // Load chat configuration on mount
  useEffect(() => {
    loadChatConfiguration(memberId, planId, memberType);
  }, [memberId, planId, memberType, loadChatConfiguration]);

  if (isLoading)
    return (
      <div role="status" aria-live="polite">
        Loading chat...
      </div>
    );
  if (error)
    return (
      <div role="alert" aria-live="assertive">
        {typeof error === 'string'
          ? error
          : error?.message || 'An error occurred.'}
      </div>
    );
  if (!isEligible)
    return (
      <div role="alert" aria-live="assertive">
        Chat is not available for your plan.
      </div>
    );

  return (
    <ChatWidget memberId={memberId} planId={planId} memberType={memberType}>
      <ChatPersistence />

      {/* Pre-chat UI */}
      {!isChatActive && isEligible && !isOOO && (
        <div className="pre-chat-ui">
          <PlanInfoHeader />
          <PlanSwitcherButton />
          <TermsAndConditions />
        </div>
      )}

      {/* Load appropriate chat widget based on mode */}
      {chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />}

      {/* In-chat UI */}
      {isChatActive && (
        <>
          <BusinessHoursBanner />
          <ChatControls />
          <ChatSession />
        </>
      )}
    </ChatWidget>
  );
}
