'use client';
import { useSession } from 'next-auth/react';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { useChatSession } from './hooks/useChatSession';
import { useChatStore } from './stores/chatStore';

export default function ChatEntry() {
  const { data: session, status } = useSession();
  const mode = useChatStore((s) => s.chatMode);

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
  return mode === 'cloud' ? (
    <CloudChatWrapper chatSession={chatSession} />
  ) : (
    <LegacyChatWrapper chatSession={chatSession} />
  );
}
