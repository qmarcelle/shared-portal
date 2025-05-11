'use client';
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import type { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import type { ChatInfoResponse } from '@/utils/api/memberService';
import { getChatInfo } from '@/utils/api/memberService';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
  const [chatPayload, setChatPayload] = useState<Record<string, any> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Extract memberId, planId, planName, hasMultiplePlans from session
  const plan = session?.user?.currUsr?.plan;
  const memberId = plan?.memCk || '';
  const planId = plan?.grpId || plan?.subId || plan?.memCk || '';
  const planName = plan?.grpId || plan?.subId || '';
  // If you have a source for multiple plans, use it; otherwise default to false
  const hasMultiplePlans = false;

  const chatSession = useChatSession({
    memberId,
    planId,
    planName,
    hasMultiplePlans,
    // ...add other options as needed
  });
  console.log('[ChatEntry] Rendered. chatMode:', mode, 'session:', session);
  // Log all relevant env vars
  const envVars = {
    NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL:
      process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
    NEXT_PUBLIC_GENESYS_WIDGET_URL: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL,
    NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS:
      process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT:
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT:
      process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT,
    NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT:
      process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT,
    NEXT_PUBLIC_OPS_PHONE: process.env.NEXT_PUBLIC_OPS_PHONE,
    NEXT_PUBLIC_OPS_HOURS: process.env.NEXT_PUBLIC_OPS_HOURS,
  };
  console.log('[ChatEntry] Env vars:', envVars);

  useEffect(() => {
    async function fetchData() {
      try {
        const memberCk = session?.user?.currUsr?.plan?.memCk;
        if (!memberCk) throw new Error('No memberCk in session');
        const loggedInUser = await getLoggedInUserInfo(memberCk);
        const chatInfoResponse = await getChatInfo('byMemberCk', memberCk);
        const chatInfo = chatInfoResponse.data;
        setChatPayload(buildChatPayload(loggedInUser, chatInfo));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    if (status === 'authenticated') fetchData();
  }, [session, status]);

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!chatPayload) return <div>Chat not available.</div>;

  // Pass chatPayload to your chat session logic or ChatService as needed
  // Example: chatSession.startChat(chatPayload)

  return mode === 'cloud' ? (
    <CloudChatWrapper chatSession={chatSession} />
  ) : (
    <LegacyChatWrapper chatSession={chatSession} />
  );
}
