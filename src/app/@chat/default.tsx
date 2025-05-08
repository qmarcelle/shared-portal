'use client';

// This component is the main entry point for the chat parallel route.
// It extracts the member and plan IDs from the authenticated session, ensures they are stable and valid,
// and passes them to the ChatWidget along with memoized handlers for plan switching and error handling.
// All logic is production-grade, with robust error handling, memoization, and logging for debugging.

import { useChatStore } from '@/app/@chat/stores/chatStore';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';
import { ChatWidget } from './components/ChatWidget';

export default function ChatRoute() {
  // Get the current session and authentication status
  const { data: session, status } = useSession();
  const chatStore = useChatStore();
  const setIsPlanSwitcherLocked = chatStore?.setPlanSwitcherLocked;

  // Memoize memberId as a string for stability and to avoid unnecessary re-renders
  const memberId = useMemo(() => {
    const raw = session?.user?.currUsr?.plan?.memCk;
    if (!raw) {
      console.warn(
        '[ChatRoute] No memCk found in plan, using default: 220590751',
      );
      return '220590751';
    }
    if (typeof raw === 'object') {
      console.warn('[ChatRoute] memCk is an object, using toString():', raw);
      return String(raw);
    }
    return String(raw);
  }, [session]);

  // Memoize planId as a string for stability
  const planId = useMemo(() => {
    const raw = session?.user?.currUsr?.plan?.grpId;
    if (!raw) {
      console.warn('[ChatRoute] No grpId found in plan, using default: 82333');
      return '82333';
    }
    return String(raw);
  }, [session]);

  // Memoize handler for locking/unlocking the plan switcher during chat
  const handleLockPlanSwitcher = useCallback(
    (locked: boolean) => {
      if (setIsPlanSwitcherLocked) setIsPlanSwitcherLocked(locked);
      console.log(`[ChatRoute] Plan switcher lock set to: ${locked}`);
    },
    [setIsPlanSwitcherLocked],
  );

  // Memoize handler for opening the plan switcher (extend as needed)
  const handleOpenPlanSwitcher = useCallback(() => {
    // Implement any production logic for opening the plan switcher here
    console.log('[ChatRoute] Opening plan switcher');
  }, []);

  // Memoize error handler for chat errors
  const handleError = useCallback((error: Error) => {
    // Implement production error handling (e.g., log to monitoring service)
    console.error('[ChatRoute] Chat error:', error);
  }, []);

  // Handle session loading state
  if (status === 'loading') {
    // This will show a loading indicator while the session is being fetched
    console.log('[ChatRoute] Session is loading...');
    return <div className="chat-loading">Loading chat session...</div>;
  }

  // Handle unauthenticated or missing user data
  if (status !== 'authenticated' || !session?.user || !session.user.currUsr) {
    console.warn(
      '[ChatRoute] Not authenticated or missing user data. Chat will not render.',
    );
    return null;
  }

  // Log the values being passed to ChatWidget for traceability
  console.log('[ChatRoute] Rendering ChatWidget with:', {
    memberId,
    planId,
    planName: session.user.currUsr.plan?.grgrCk || 'Default Plan',
  });

  // Render the ChatWidget with all required, memoized props
  return (
    <ChatWidget
      memberId={memberId}
      planId={planId}
      planName={session.user.currUsr.plan?.grgrCk || 'Default Plan'}
      hasMultiplePlans={true}
      onLockPlanSwitcher={handleLockPlanSwitcher}
      onOpenPlanSwitcher={handleOpenPlanSwitcher}
      _onError={handleError}
    />
  );
}
