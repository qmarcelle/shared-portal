'use client';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { useChatStore } from './stores/chatStore';

export default function ChatEntry() {
  const mode = useChatStore((s) => s.chatMode);
  console.log('[ChatEntry] Rendered. chatMode:', mode);
  // Log all relevant env vars
  const envVars = {
    NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL: process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
    NEXT_PUBLIC_GENESYS_WIDGET_URL: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL,
    NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT,
    NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT,
    NEXT_PUBLIC_OPS_PHONE: process.env.NEXT_PUBLIC_OPS_PHONE,
    NEXT_PUBLIC_OPS_HOURS: process.env.NEXT_PUBLIC_OPS_HOURS,
  };
  console.log('[ChatEntry] Env vars:', envVars);
  return mode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}
