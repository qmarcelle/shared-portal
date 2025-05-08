'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';
import { GenesysScript } from './GenesysScript';

interface ChatWidgetProps {
  memberId: string | number;
  planId: string;
  planName?: string;
  hasMultiplePlans?: boolean;
  onLockPlanSwitcher?: (locked: boolean) => void;
  onOpenPlanSwitcher?: () => void;
  _onError?: (error: Error) => void;
  memberType?: string;
  children?: ReactNode; // Add support for children
  // Add a new prop to force enable the chat (for development/testing)
  forceEnable?: boolean;
}

export function ChatWidget({
  memberId,
  planId,
  planName,
  hasMultiplePlans = false,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  _onError,
  memberType = 'byMemberCk',
  children, // Add children to the parameter list
  forceEnable = true, // Default to true to fix the issue
}: ChatWidgetProps) {
  const {
    loadChatConfiguration,
    isLoading,
    error,
    isEligible,
    chatMode,
    userData,
    isOOO,
  } = useChatStore();

  const initializedRef = useRef(false);

  // Handle plan switcher lock/unlock
  usePlanSwitcherLock(hasMultiplePlans);

  // Add debugging for widget state
  useEffect(() => {
    console.log('[ChatWidget] Widget state:', {
      memberId,
      planId,
      isLoading,
      isEligible,
      isOOO,
      hasError: !!error,
      chatMode,
      initializedRef: initializedRef.current,
      forceEnable,
    });
  }, [
    memberId,
    planId,
    isLoading,
    isEligible,
    isOOO,
    error,
    chatMode,
    forceEnable,
  ]);

  // Initialize chat configuration
  useEffect(() => {
    if (initializedRef.current) return;

    // Set initializedRef to true IMMEDIATELY to prevent duplicate calls
    initializedRef.current = true;

    const loadConfig = async () => {
      try {
        // Properly extract and validate memberId
        let validMemberId;

        if (typeof memberId === 'string') {
          validMemberId = memberId;
        } else if (typeof memberId === 'number') {
          validMemberId = memberId.toString();
        } else if (
          memberId &&
          typeof memberId === 'object' &&
          'memCk' in memberId
        ) {
          // If memberId is an object with memCk property, extract that value
          validMemberId = (memberId as any).memCk;
          console.warn(
            '[ChatWidget] memberId was passed as object, extracted memCk:',
            validMemberId,
          );
        } else {
          console.error('[ChatWidget] Invalid memberId format:', memberId);
          return; // Exit early to prevent API calls with invalid data
        }

        // Validate planId too
        if (!planId) {
          console.error('[ChatWidget] Missing planId');
          return;
        }

        console.log('[ChatWidget] Loading chat configuration with:', {
          memberId: validMemberId,
          planId: planId,
          memberType: memberType,
        });
        //Verify that the memberId is a stringify that the memberId is a string
        await loadChatConfiguration(validMemberId, planId, memberType);

        console.log('[ChatWidget] Chat configuration loaded successfully');
      } catch (error) {
        console.error('[ChatWidget] Error loading chat configuration:', error);
        if (_onError) _onError(error as Error);
      }
    };

    loadConfig();
  }, [loadChatConfiguration, memberId, planId, memberType, _onError]);

  // Handle rendering based on state
  if (isLoading) {
    console.log('[ChatWidget] Showing loading state');
    return null; // You might want to show a loading indicator here
  }

  // If not eligible or error, don't render the widget
  if ((!isEligible && !forceEnable) || error) {
    return null;
  }

  // If out of office hours and not forcing display, don't render
  if (isOOO && !forceEnable) {
    return null;
  }

  console.log(
    '[ChatWidget] Rendering chat widget container with chat mode:',
    chatMode,
  );

  return (
    <>
      {/* Always add the Genesys script for initialization */}
      <GenesysScript
        userData={userData}
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!}
        onScriptLoaded={() => {
          console.log(
            '[ChatWidget] Genesys script loaded, attempting to enable chat button',
          );
        }}
      />
    </>
  );
}
