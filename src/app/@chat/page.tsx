'use client';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import CloudChatWrapper from './components/CloudChatWrapper';
import LegacyChatWrapper from './components/LegacyChatWrapper';

export default function ChatEntry() {
  const mode = useChatStore((s) => s.chatMode);
  if (mode === 'cloud') {
    return <CloudChatWrapper />;
  }
  return <LegacyChatWrapper />;
}