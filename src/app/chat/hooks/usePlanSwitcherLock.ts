'use client';

import { usePlanStore } from '@/userManagement/stores/planStore';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

/**
 * Hook that locks plan switching when chat is active
 * Subscribes to isChatActive in the chatStore and calls
 * setLocked and showHover in the planStore
 */
export function usePlanSwitcherLock() {
  const isChatActive = useChatStore((state) => state.isChatActive);
  const { setLocked, showHover } = usePlanStore();

  useEffect(() => {
    setLocked(isChatActive);
    if (isChatActive) {
      showHover('You cannot switch plans during an active chat session.');
    } else {
      showHover('');
    }

    return () => {
      // Cleanup - ensure plan switcher is unlocked when component unmounts
      setLocked(false);
      showHover('');
    };
  }, [isChatActive, setLocked, showHover]);
}

export default usePlanSwitcherLock;
