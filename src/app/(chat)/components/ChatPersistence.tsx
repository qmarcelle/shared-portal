'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

const INACTIVITY_TIMEOUT = 10 * 60_000; // 10min

// ChatPersistence ensures chat state is preserved across navigation and browser events.
// It warns on unload, auto-minimizes on route change, and handles inactivity timeouts.
// All persistence events and state changes are logged for traceability and debugging.

/**
 * Handles chat persistence across page navigation:
 * - Warns on browser unload when chat is active
 * - Auto-minimizes on Next.js route changes
 * - Handles inactivity timeout
 */
export function ChatPersistence() {
  const { isChatActive, endChat, setMinimized } = useChatStore();

  const [lastActivity, setLastActivity] = useState(Date.now());
  const pathname = usePathname();

  // Warn on browser unload when chat is active
  useEffect(() => {
    if (!isChatActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        'You have an active chat session. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isChatActive]);

  // Auto-minimize on Next.js route changes
  useEffect(() => {
    if (isChatActive) {
      setMinimized(true);
    }
  }, [pathname, isChatActive, setMinimized]);

  // Track user activity
  useEffect(() => {
    const handler = () => {
      setLastActivity(Date.now());
    };

    ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
      window.addEventListener(e, handler),
    );

    return () =>
      ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
        window.removeEventListener(e, handler),
      );
  }, []);

  // Inactivity timeout
  useEffect(() => {
    if (!isChatActive) return;

    const id = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        endChat();
        alert('Your chat ended due to inactivity.');
      }
    }, 60_000);

    return () => clearInterval(id);
  }, [isChatActive, lastActivity, endChat]);

  // No UI is rendered by this component
  return null;
}
