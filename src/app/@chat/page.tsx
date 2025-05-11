'use client';
import type { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import type { ChatInfoResponse } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { chatSelectors, useChatStore } from './stores/chatStore';

// Log when the page component loads - helps debug parallel route issues
logger.info('[@@chat/page.tsx] Component loaded', {
  timestamp: new Date().toISOString(),
});

// This function is kept for type checking but not actively used
// since we now use chatStore to manage all chat config
function buildChatPayload(
  loggedInUser: LoggedInUserInfo,
  chatInfo: ChatInfoResponse,
) {
  return {
    PLAN_ID: chatInfo.PLAN_ID,
    GROUP_ID: chatInfo.GROUP_ID,
    LOB: loggedInUser.lob,
    lob_group: loggedInUser.groupData?.groupName,
    IsMedicalEligibile: chatInfo.coverage_eligibility === 'Medical',
    IsDentalEligible: chatInfo.coverage_eligibility === 'Dental',
    IsVisionEligible: chatInfo.coverage_eligibility === 'Vision',
    Origin: chatInfo.Origin,
    Source: chatInfo.Source,
    member_ck: chatInfo.member_ck,
    first_name: chatInfo.first_name,
    last_name: chatInfo.last_name,
    // ...add any other fields needed by your Genesys integration
  };
}

/**
 * Chat Parallel Route Entry Point
 * This component loads in the @chat slot of the layout
 * It determines whether to show legacy or cloud chat based on eligibility
 */
export default function ChatEntryPoint() {
  const { isChatActive, isOpen, isLoading, error } = useChatStore();
  const chatMode = chatSelectors.chatMode(useChatStore());

  // Set up chat session object for passing to wrappers
  const chatSession = {
    isOpen,
    isChatActive,
    isLoading,
    error,
    startChat: useChatStore.getState().startChat,
    endChat: useChatStore.getState().endChat,
  };

  useEffect(() => {
    logger.info('[ChatEntry] Chat parallel route mounted', {
      chatMode,
      isOpen,
      isChatActive,
      timestamp: new Date().toISOString(),
    });
  }, [chatMode, isOpen, isChatActive]);

  // Render nothing if chat is not open
  if (!isOpen) return null;

  // Render the appropriate chat wrapper based on eligibility
  return (
    <div className="chat-container">
      {chatMode === 'cloud' ? (
        <CloudChatWrapper chatSession={chatSession} />
      ) : (
        <LegacyChatWrapper chatSession={chatSession} />
      )}
    </div>
  );
}
