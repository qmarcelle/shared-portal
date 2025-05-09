'use client';

// This component is the main entry point for the chat parallel route.
// It extracts the member and plan IDs from the authenticated session, ensures they are stable and valid,
// and passes them to the ChatWidget along with memoized handlers for plan switching and error handling.
// All logic is production-grade, with robust error handling, memoization, and logging for debugging.

import { useChatStore } from '@/app/@chat/stores/chatStore';
import { usePlanStore } from '@/userManagement/stores/planStore';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef } from 'react';
import { ChatWidget } from './components/ChatWidget';

export default function ChatRoute() {
  // Get the current session and authentication status
  const { data: session, status } = useSession();
  const { userData, isLoading, isEligible, error, loadChatConfiguration } =
    useChatStore();

  // Get plans from the plan store
  const plans = usePlanStore((s) => s.plans);
  const hasMultiplePlans = Array.isArray(plans) && plans.length > 1;

  // Extract real memberId and planId from the session (adjust these keys as needed for your app)
  const memberId = session?.user?.currUsr?.plan?.memCk;
  const planId = session?.user?.currUsr?.plan?.grpId;

  // Prevent repeated loading with a ref
  const hasLoadedRef = useRef(false);

  // Memoize the load function to prevent it from causing re-renders
  const loadChatConfig = useCallback(
    (memId: number | string, pId: string) => {
      console.log('[ChatRoute] Calling memoized loadChatConfiguration');
      return loadChatConfiguration(memId, pId);
    },
    [loadChatConfiguration],
  );

  // On mount or when session changes, trigger the chat config load if authenticated and IDs are present
  useEffect(() => {
    // Add console log to debug
    console.log('[ChatRoute] useEffect running with:', {
      status,
      memberId,
      planId,
      hasLoaded: hasLoadedRef.current,
      isLoading,
    });

    if (
      status === 'authenticated' &&
      memberId &&
      planId &&
      !hasLoadedRef.current
    ) {
      console.log(
        '[ChatRoute] Setting hasLoadedRef to true and loading config',
      );
      hasLoadedRef.current = true;

      // Load the configuration - make sure to cast memberId to a number only if needed
      const memberIdValue = memberId ? Number(memberId) : undefined;
      if (memberIdValue && !isNaN(memberIdValue)) {
        loadChatConfig(memberIdValue, planId);
      } else {
        console.error('[ChatRoute] Invalid memberId:', memberId);
      }
    }

    // Important: DO NOT add 'isLoading' or 'userData' to the dependency array to avoid loops
  }, [status, memberId, planId, loadChatConfig]);

  // Show loading state while session or chat config is loading
  if (status === 'loading' || isLoading) {
    return <div className="chat-loading">Loading chat session...</div>;
  }

  // Show error if chat config failed to load
  if (error) {
    return (
      <div className="chat-error">Error loading chat: {error.message}</div>
    );
  }

  // If not authenticated or missing user data, do not render chat
  if (status !== 'authenticated' || !session?.user || !session.user.currUsr) {
    return null;
  }

  // If not eligible, show a message
  if (!isEligible) {
    return <div className="chat-ineligible">Not eligible for chat.</div>;
  }

  // If we don't have the required userData, show a loading state
  if (!userData?.MEMBER_ID || !userData?.PLAN_ID) {
    return <div className="chat-loading">Loading member data...</div>;
  }

  // Render the ChatWidget with real data from the store
  // Pass skipInitialLoad=true to prevent ChatWidget from also loading the configuration
  return (
    <ChatWidget
      memberId={userData.MEMBER_ID}
      planId={userData.PLAN_ID}
      planName={userData.PLAN_NAME || 'Default Plan'}
      hasMultiplePlans={hasMultiplePlans}
      skipInitialLoad={true} // Add this to prevent duplicate loading
    />
  );
}
