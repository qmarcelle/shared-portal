'use client';
import type { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import type { ChatInfoResponse } from '@/utils/api/memberService';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { useChatSession } from './hooks/useChatSession';
import { useChatStore } from './stores/chatStore';

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
  const { data: session, status } = useSession();
  const mode = useChatStore((s) => s.chatMode);
  const eligibility = useChatStore((s) => s.eligibility);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const loadChatConfiguration = useChatStore((s) => s.loadChatConfiguration);

  // Extract memberId, planId, planName, hasMultiplePlans from session
  const plan = session?.user?.currUsr?.plan;
  const memberId = plan?.memCk || '';
  const planId = plan?.grpId || plan?.subId || plan?.memCk || '';
  const planName = plan?.grpId || plan?.subId || '';
  const hasMultiplePlans = false;

  // Always call useChatSession to satisfy React hook rules
  const chatSession = useChatSession({
    memberId: memberId || '',
    planId: planId || '',
    planName: planName || '',
    hasMultiplePlans,
    chatConfig: eligibility || {},
  });

  useEffect(() => {
    if (status === 'authenticated' && memberId && planId) {
      loadChatConfiguration(memberId, planId);
    }
  }, [status, memberId, planId, loadChatConfiguration]);

  // Robust loading and error handling
  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!eligibility || !eligibility.isEligible)
    return <div>Chat not available.</div>;
  if (!chatSession) return <div>Chat session could not be initialized.</div>;

  // Render the correct chat wrapper based on mode
  return mode === 'cloud' ? (
    <CloudChatWrapper chatSession={chatSession} />
  ) : (
    <LegacyChatWrapper chatSession={chatSession} />
  );
}
