'use client';

import { ChatWidget } from '@/app/@chat/components/ChatWidget';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { useSession } from 'next-auth/react';

export default function ChatRoute() {
  const { data: session, status } = useSession();
  const chatStore = useChatStore();
  const setIsPlanSwitcherLocked = chatStore?.setPlanSwitcherLocked;
  
  // Don't render anything while loading or if not authenticated
  if (status !== 'authenticated' || !session?.user?.currUsr?.plan) {
    return null;
  }

  return (
    <ChatWidget
      memberId={session.user.currUsr.plan.memCk}
      planId={session.user.currUsr.plan.grpId}
      planName={session.user.currUsr.plan.grgrCk}
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