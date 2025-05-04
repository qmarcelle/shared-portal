'use client';

import { ChatServiceProvider } from '@/app/chat';
import { ChatWidget } from '@/app/chat/components/ChatWidget';
import { GenesysScripts } from '@/app/chat/components/GenesysScripts';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { getCachedPersonBusinessEntity } from '@/utils/pbeCache';
import { useCallback, useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const chatStore = useChatStore();
  const setIsPlanSwitcherLocked = chatStore?.setPlanSwitcherLocked;
  
  // State to track multiple plans
  const [hasMultiplePlans, setHasMultiplePlans] = useState(false);
  // Add loading state to prevent rendering before data is ready
  const [isLoading, setIsLoading] = useState(true);
  
  // Move the logic for checking plans to a useCallback to avoid recreating on every render
  const checkForMultiplePlans = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const pbeData = await getCachedPersonBusinessEntity(userId);
      
      // Count distinct active plan IDs
      const planIds = new Set<string>();
      const now = new Date();
      
      if (pbeData?.getPBEDetails) {
        for (const detail of pbeData.getPBEDetails) {
          for (const info of detail.relationshipInfo) {
            try {
              const termDate = new Date(info.roleTermDate);
              // Only count plans that aren't expired
              if (termDate > now && info.memeCk) {
                planIds.add(info.memeCk);
              }
            } catch (err) {
              // Skip invalid dates rather than crashing
              console.error('Invalid date format in plan data:', info.roleTermDate);
            }
          }
        }
      }
      
      setHasMultiplePlans(planIds.size > 1);
    } catch (error) {
      console.error("Error checking for multiple plans:", error);
      setHasMultiplePlans(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load plans data once when user is available
  useEffect(() => {
    if (user?.id) {
      checkForMultiplePlans(user.id);
    } else {
      // Reset if no user
      setHasMultiplePlans(false);
      setIsLoading(false);
    }
  }, [user?.id, checkForMultiplePlans]);

  // Don't render chat components while loading
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isAuthenticated && user && user.currUsr?.plan && setIsPlanSwitcherLocked && (
        <>
          <ChatServiceProvider
            memberId={user.currUsr.plan.memCk}
            planId={user.currUsr.plan.grpId}
            planName={user.currUsr.plan.grgrCk}
            hasMultiplePlans={hasMultiplePlans}
            onLockPlanSwitcher={setIsPlanSwitcherLocked}
          >
            <GenesysScripts
              deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
              environment={process.env.NEXT_PUBLIC_GENESYS_REGION || 'us-east-1'}
              orgId={process.env.NEXT_PUBLIC_GENESYS_ORG_ID || ''}
              memberId={user.currUsr.plan.memCk}
              planId={user.currUsr.plan.grpId}
              debug={process.env.NEXT_PUBLIC_DEBUG === 'true'}
            />
            <ChatWidget
              memberId={user.currUsr.plan.memCk}
              planId={user.currUsr.plan.grpId}
              planName={user.currUsr.plan.grgrCk}
              hasMultiplePlans={hasMultiplePlans}
              onLockPlanSwitcher={setIsPlanSwitcherLocked}
              onOpenPlanSwitcher={() => {
                console.log('Opening plan switcher');
              }}
              _onError={(error: Error) => {
                console.error('Chat error:', error);
              }}
            />
          </ChatServiceProvider>
        </>
      )}
    </>
  );
}
