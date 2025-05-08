'use client';

import { ChatWidget } from '@/app/@chat/components/ChatWidget';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ChatRoute() {
  const { data: session, status } = useSession();
  const chatStore = useChatStore();
  const setIsPlanSwitcherLocked = chatStore?.setPlanSwitcherLocked;
  
  // Add debugging for session data
  useEffect(() => {
    console.log('[ChatRoute] Session status:', status);
    console.log('[ChatRoute] Session data available:', !!session);
    if (session?.user) {
      console.log('[ChatRoute] User data structure:', {
        hasCurrUsr: !!session.user.currUsr,
        planData: session.user.currUsr?.plan || 'No plan data',
        userKeys: Object.keys(session.user),
        planKeys: session.user.currUsr?.plan ? Object.keys(session.user.currUsr.plan) : [],
        memCk: session.user.currUsr?.plan?.memCk || 'Not available'
      });
    }
  }, [session, status]);
  
  // Don't render anything while loading
  if (status === 'loading') {
    console.log('[ChatRoute] Still loading session data...');
    return <div className="chat-loading">Loading chat session...</div>;
  }
  
  // Don't render if not authenticated
  if (status !== 'authenticated' || !session?.user) {
    console.log('[ChatRoute] Not authenticated or no session user data');
    return null;
  }
  
  // Check for plan data to determine what to render
  if (!session.user.currUsr) {
    console.log('[ChatRoute] No user data in session');
    return null;
  }

  // Extract member ID (memCk) from plan - ensure it's a proper string, not an object
  let memberId;
  if (session.user.currUsr.plan?.memCk) {
    // Ensure memCk is a string, not an object
    if (typeof session.user.currUsr.plan.memCk === 'object') {
      console.warn('[ChatRoute] memCk is an object, using toString():', session.user.currUsr.plan.memCk);
      memberId = String(session.user.currUsr.plan.memCk);
    } else {
      memberId = session.user.currUsr.plan.memCk;
    }
  } else {
    // Fallback to default value if memCk is not available
    memberId = "220590751"; // Default from logs as fallback
    console.warn('[ChatRoute] No memCk found in plan, using default:', memberId);
  }
                      
  // Extract planId (grpId) from plan with similar validation
  const planId = session.user.currUsr.plan?.grpId || "82333"; // Default from logs if needed
  
  console.log('[ChatRoute] Rendering ChatWidget with:', { 
    memberId, 
    planId, 
    memberIdType: typeof memberId,
    planIdType: typeof planId
  });

  return (
    <ChatWidget
      memberId={memberId}
      planId={planId}
      planName={session.user.currUsr.plan?.grgrCk || "Default Plan"}
      hasMultiplePlans={true}
      onLockPlanSwitcher={(locked: boolean) => {
        if (setIsPlanSwitcherLocked) {
          setIsPlanSwitcherLocked(locked);
        }
      }}
      onOpenPlanSwitcher={() => {
        // Handle opening plan switcher
        console.log('Opening plan switcher');
      }}
      _onError={(error: Error) => {
        // Handle chat errors
        console.error('Chat error:', error);
      }}
    />
  );
}