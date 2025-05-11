'use client';
import type { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import type { ChatInfoResponse } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { useChatSession } from './hooks/useChatSession';
import { useChatStore } from './stores/chatStore';

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

export default function ChatEntry() {
  logger.info('[@@chat/page.tsx] ChatEntry rendering', {
    timestamp: new Date().toISOString(),
  });

  const { data: session, status } = useSession();
  const mode = useChatStore((s) => s.chatMode);
  const eligibility = useChatStore((s) => s.eligibility);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const loadChatConfiguration = useChatStore((s) => s.loadChatConfiguration);

  // Log the session and status for debugging
  logger.info('[@@chat/page.tsx] Session state', {
    hasSession: !!session,
    status,
    timestamp: new Date().toISOString(),
  });

  // Extract memberId, planId, planName, hasMultiplePlans from session
  const plan = session?.user?.currUsr?.plan;
  const memberId = plan?.memCk || '';
  const planId = plan?.grpId || plan?.subId || plan?.memCk || '';
  const planName = plan?.grpId || plan?.subId || '';
  const hasMultiplePlans = false;

  // Always call useChatSession to satisfy React hook rules
  // Pass eligibility from store as chatConfig
  const chatSession = useChatSession({
    memberId: memberId || '',
    planId: planId || '',
    planName: planName || '',
    hasMultiplePlans,
    chatConfig: eligibility || {},
  });

  // Log when useChatSession is called
  logger.info('[@@chat/page.tsx] useChatSession initialized', {
    hasMemberId: !!memberId,
    hasPlanId: !!planId,
    hasEligibility: !!eligibility,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (status === 'authenticated' && memberId && planId) {
      logger.info('[@@chat/page.tsx] Loading chat configuration', {
        memberId,
        planId,
        timestamp: new Date().toISOString(),
      });
      loadChatConfiguration(memberId, planId);
    }
  }, [status, memberId, planId, loadChatConfiguration]);

  // Robust loading and error handling
  if (isLoading) {
    logger.info('[@@chat/page.tsx] Chat is loading', {
      timestamp: new Date().toISOString(),
    });
    return <div>Loading chat...</div>;
  }

  if (error) {
    logger.error('[@@chat/page.tsx] Chat error occurred', {
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    return <div>Error: {error.message}</div>;
  }

  if (!eligibility || !eligibility.isEligible) {
    logger.info('[@@chat/page.tsx] Chat not available', {
      hasEligibility: !!eligibility,
      isEligible: eligibility?.isEligible,
      timestamp: new Date().toISOString(),
    });
    return <div>Chat not available.</div>;
  }

  if (!chatSession) {
    logger.error('[@@chat/page.tsx] Chat session not initialized', {
      timestamp: new Date().toISOString(),
    });
    return <div>Chat session could not be initialized.</div>;
  }

  // Log before rendering the appropriate chat wrapper
  logger.info('[@@chat/page.tsx] Rendering chat wrapper', {
    mode,
    timestamp: new Date().toISOString(),
  });

  // Render the correct chat wrapper based on mode
  return mode === 'cloud' ? (
    <CloudChatWrapper chatSession={chatSession} />
  ) : (
    <LegacyChatWrapper chatSession={chatSession} />
  );
}
