import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

const LOG_PREFIX = '[usePlanSwitcherLock]';

/**
 * @file usePlanSwitcherLock.ts
 * @description Custom hook to manage locking/unlocking the plan switcher UI based on chat activity.
 * This hook directly supports requirements related to plan switcher behavior during active chat sessions.
 * - ID: 31158: Plan switcher must be locked during active chat sessions.
 * - ID: 31158: Plan switcher must be unlocked when a chat session ends.
 * - ID: 31159: Ensures the correct tooltip message state is managed by the store when locking/unlocking.
 */
export function usePlanSwitcherLock(): void {
  // Selects whether the chat is currently considered active from the store.
  const isChatActive = useChatStore((state) => state.session.isChatActive);
  // Selects the current locked state of the plan switcher from the store.
  const isPlanSwitcherLocked = useChatStore(
    (state) => state.session.isPlanSwitcherLocked,
  );
  // Action to set the plan switcher's locked state and tooltip message in the store.
  const setPlanSwitcherLocked = useChatStore(
    (state) => state.actions.setPlanSwitcherLocked,
  );

  useEffect(() => {
    // If chat is active and the plan switcher isn't already locked, lock it.
    if (isChatActive && !isPlanSwitcherLocked) {
      logger.info(
        `${LOG_PREFIX} Chat is active and plan switcher is not locked. Locking.`,
      );
      // Calls the store action to lock the plan switcher.
      // The action itself will set the appropriate tooltip message for ID: 31159.
      setPlanSwitcherLocked(true);
    } else if (!isChatActive && isPlanSwitcherLocked) {
      // If chat is not active but the plan switcher is locked, unlock it.
      logger.info(
        `${LOG_PREFIX} Chat is inactive and plan switcher is locked. Unlocking.`,
      );
      // Calls the store action to unlock the plan switcher and clear the tooltip message.
      setPlanSwitcherLocked(false);
    }
    // Dependencies: Re-run this effect if chat activity state or plan switcher lock state changes.
  }, [isChatActive, isPlanSwitcherLocked, setPlanSwitcherLocked]);
}
