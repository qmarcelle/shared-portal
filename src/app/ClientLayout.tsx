'use client';

import { ChatWidget } from '@/app/chat/components/ChatWidget';
import { useAuth } from '@/hooks/useAuth';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {children}
      {isAuthenticated && user && user.currUsr?.plan && (
        <ChatWidget
          memberId={user.currUsr.umpi}
          planId={user.currUsr.plan.grpId}
          planName={user.currUsr.plan.grgrCk}
          hasMultiplePlans={true}
          onLockPlanSwitcher={(locked) => {
            // Handle plan switcher lock
            console.log('Plan switcher locked:', locked);
          }}
          onOpenPlanSwitcher={() => {
            // Handle opening plan switcher
            console.log('Opening plan switcher');
          }}
          onError={(error) => {
            // Handle chat errors
            console.error('Chat error:', error);
          }}
        />
      )}
    </>
  );
}
