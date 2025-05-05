// src/hooks/useChatEventHandlers.ts
import { useChatStore } from '@/app/chat/stores/chatStore';
import { useEffect } from 'react';

export function useChatEventHandlers() {
  const startChat = useChatStore((s: any) => s.startChat);
  const endChat = useChatStore((s: any) => s.endChat);

  useEffect(() => {
    // Legacy WebChat events
    const subs: Array<() => void> = [];
    if (window.CXBus) {
      window.CXBus?.subscribe?.('WebChat.opened', startChat);
      window.CXBus?.subscribe?.('WebChat.closed', endChat);
      window.CXBus?.subscribe?.('WebChat.error', endChat);
      subs.push(
        () => window.CXBus?.unsubscribe?.('WebChat.opened', startChat),
        () => window.CXBus?.unsubscribe?.('WebChat.closed', endChat),
        () => window.CXBus?.unsubscribe?.('WebChat.error', endChat),
      );
    }
    // Cloud Messenger events
    if (window.MessengerWidget) {
      window.MessengerWidget?.on?.('open', startChat);
      window.MessengerWidget?.on?.('close', endChat);
      window.MessengerWidget?.on?.('error', endChat);
      subs.push(
        () => window.MessengerWidget?.off?.('open', startChat),
        () => window.MessengerWidget?.off?.('close', endChat),
        () => window.MessengerWidget?.off?.('error', endChat),
      );
    }

    return () => subs.forEach((unsub) => unsub());
  }, [startChat, endChat]);
}
