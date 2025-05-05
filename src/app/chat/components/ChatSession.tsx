'use client';
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10min

export default function ChatSession() {
  const { isChatActive, endChat } = useChatStore();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [agentTyping, setAgentTyping] = useState(false);

  // Reset timer on user interaction
  useEffect(() => {
    if (!isChatActive) return;
    const handler = () => setLastActivity(Date.now());
    ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
      window.addEventListener(e, handler),
    );
    return () =>
      ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
        window.removeEventListener(e, handler),
      );
  }, [isChatActive]);

  // Subscribe to typing events
  useEffect(() => {
    if (!isChatActive) return;

    // Handler for both MessengerWidget and CXBus
    const onTyping = (d: any) => {
      // MessengerWidget: { typing: boolean }
      // CXBus: { data: { typing: boolean } }
      if (typeof d?.typing === 'boolean') {
        setAgentTyping(d.typing);
      } else if (typeof d?.data?.typing === 'boolean') {
        setAgentTyping(d.data.typing);
      }
    };

    window.MessengerWidget?.on?.('typingIndicator', onTyping);
    window.CXBus?.subscribe?.('WebChat.agentTyping', onTyping);

    return () => {
      window.MessengerWidget?.off?.('typingIndicator', onTyping);
      window.CXBus?.unsubscribe?.('WebChat.agentTyping', onTyping);
    };
  }, [isChatActive]);

  // Inactivity timeout
  useEffect(() => {
    if (!isChatActive) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        endChat();
        alert('Your chat ended due to inactivity.');
      }
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [isChatActive, lastActivity, endChat]);

  if (!isChatActive) return null;
  return agentTyping ? (
    <div className="agent-typing">Agent is typing...</div>
  ) : null;
}
