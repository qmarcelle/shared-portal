'use client';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';
import { useChatStore } from './stores/chatStore';

export default function ChatEntry() {
  const mode = useChatStore((s) => s.chatMode);
  return mode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}
