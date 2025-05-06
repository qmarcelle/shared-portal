// src/hooks/useChatEventHandlers.ts
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { useEffect } from 'react';

export function useChatEventHandler(p0: { onLockPlanSwitcher: ((locked: boolean) => void) | undefined; onOpenPlanSwitcher: (() => void) | undefined; onError: ((error: Error) => void) | undefined; }) {
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
        () => window.CXBus?.runtime.unsubscribe?.('WebChat.opened'),
        () => window.CXBus?.runtime.unsubscribe?.('WebChat.closed'),
        () => window.CXBus?.runtime.unsubscribe?.('WebChat.error'),
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
