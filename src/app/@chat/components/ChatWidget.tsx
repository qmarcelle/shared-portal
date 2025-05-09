'use client';

// ChatWidget is the main orchestrator for the chat experience.
// It loads chat configuration, manages eligibility, and injects the Genesys script.
// All state and side effects are logged for traceability and debugging.

import { ReactNode, useEffect, useRef } from 'react';
import { GenesysScript } from '../../components/GenesysScript';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';

interface ChatWidgetProps {
  memberId: string | number; // Unique member identifier (should always be a string)
  planId: string; // Unique plan identifier
  planName?: string; // Optional plan name for display
  hasMultiplePlans?: boolean; // If true, enables plan switcher UI
  onLockPlanSwitcher?: (locked: boolean) => void; // Callback to lock/unlock plan switcher
  onOpenPlanSwitcher?: () => void; // Callback to open plan switcher
  _onError?: (error: Error) => void; // Error handler
  memberType?: string; // Member type for API
  children?: ReactNode; // Optional children for extensibility
  forceEnable?: boolean; // Force enable chat (for dev/testing)
  skipInitialLoad?: boolean; // Skip initial loading if configuration is loaded elsewhere
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
  children,
  forceEnable = true,
  skipInitialLoad = false,
}: ChatWidgetProps) {
  // Zustand store for chat state and actions
  const {
    loadChatConfiguration,
    isLoading,
    error,
    isEligible,
    chatMode,
    userData,
    isOOO,
  } = useChatStore();

  // Ref to ensure chat config is only loaded once per mount
  const initializedRef = useRef(false);

  // Lock/unlock plan switcher if multiple plans are present
  usePlanSwitcherLock(hasMultiplePlans);

  // Log all relevant state and prop changes for debugging
  useEffect(() => {
    console.log('[ChatWidget] Widget state:', {
      memberId,
      planId,
      planName,
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
    planName,
    isLoading,
    isEligible,
    isOOO,
    error,
    chatMode,
    forceEnable,
  ]);

  // Load chat configuration on first mount
  useEffect(() => {
    if (initializedRef.current || skipInitialLoad) return;
    initializedRef.current = true;

    const loadConfig = async () => {
      try {
        // Validate and normalize memberId
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
          validMemberId = (memberId as any).memCk;
          console.warn(
            '[ChatWidget] memberId was object, extracted memCk:',
            validMemberId,
          );
        } else {
          console.error('[ChatWidget] Invalid memberId format:', memberId);
          return; // Prevent API call with invalid data
        }

        // Validate planId
        if (!planId) {
          console.error('[ChatWidget] Missing planId');
          return;
        }

        // Log configuration load attempt
        console.log('[ChatWidget] Loading chat configuration with:', {
          memberId: validMemberId,
          planId,
          memberType,
        });
        await loadChatConfiguration(validMemberId, planId, memberType);
        console.log('[ChatWidget] Chat configuration loaded successfully');
      } catch (error) {
        console.error('[ChatWidget] Error loading chat configuration:', error);
        if (_onError) _onError(error as Error);
      }
    };

    loadConfig();
  }, [
    loadChatConfiguration,
    memberId,
    planId,
    memberType,
    _onError,
    skipInitialLoad,
  ]);

  // Show loading indicator if chat config is loading
  if (isLoading) {
    console.log('[ChatWidget] Showing loading state');
    return null; // Optionally, render a spinner or skeleton here
  }

  // If not eligible or error, don't render the widget
  if ((!isEligible && !forceEnable) || error) {
    console.warn(
      '[ChatWidget] Not eligible or error present, not rendering chat widget.',
    );
    return null;
  }

  // If out of office hours and not forcing display, don't render
  if (isOOO && !forceEnable) {
    console.log('[ChatWidget] Out of office hours, not rendering chat widget.');
    return null;
  }

  // Log rendering of the chat widget container
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
      {/* Render children if provided (for extensibility/testing) */}
      {children}
    </>
  );
}
