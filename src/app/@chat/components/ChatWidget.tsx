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

  // Initialize chat configuration
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadConfig = async () => {
      try {
        // Parse memberId to number if it's a string
        const memberIdNum =
          typeof memberId === 'string' ? parseInt(memberId, 10) : memberId;
        await loadChatConfiguration(memberIdNum, planId, memberType);
      } catch (err) {
        console.error('Failed to load chat configuration:', err);
        if (_onError)
          _onError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    loadConfig();
  }, [memberId, planId, memberType, loadChatConfiguration, _onError]);

  // Don't render anything if loading or not eligible or outside business hours
  if (isLoading || !isEligible || isOOO) {
    return null;
  }

  // Handle error state
  if (error) {
    console.error('Chat error:', error);
    return null;
  }

  return (
    <div className="chat-widget-container">
      {children}

      {/* Only load the Genesys script for cloud chat mode */}
      {chatMode === 'cloud' && (
        <GenesysScript
          deploymentId="52dd824c-f565-47a6-a6d5-f30d81c97491"
          userData={userData}
        />
      )}
    </div>
  );
}
