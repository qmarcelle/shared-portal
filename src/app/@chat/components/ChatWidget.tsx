'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';
import { GenesysScript } from './GenesysScript';
import { ChatButton } from './ChatButton';

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

// Add a utility function to enable the chat button
const enableChatButton = () => {
  console.log('[ChatWidget] Attempting to enable chat button');
  
  // Try different approaches to enable the button
  if (window._genesys && window._genesys.widgets && window._genesys.widgets.webchat) {
    console.log('[ChatWidget] Found Genesys widget, configuring chat button');
    window._genesys.widgets.webchat.chatButton = {
      enabled: true,
      openDelay: 100,
      effectDuration: 200,
      hideDuringInvite: false
    };

    // Force button visibility after a delay
    setTimeout(() => {
      const chatButton = document.querySelector('.cx-webchat-chat-button');
      if (chatButton) {
        console.log('[ChatWidget] Found chat button, enhancing visibility');
        (chatButton as HTMLElement).style.display = 'block';
        (chatButton as HTMLElement).style.visibility = 'visible';
        (chatButton as HTMLElement).style.opacity = '1';
      }
    }, 2000);

  } else {
    console.log('[ChatWidget] Genesys widget not found, will try again');
    // If Genesys isn't loaded yet, try again after a delay
    setTimeout(enableChatButton, 1000);
  }
};

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
      forceEnable
    });
  }, [memberId, planId, isLoading, isEligible, isOOO, error, chatMode, forceEnable]);

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
        } else if (memberId && typeof memberId === 'object' && 'memCk' in memberId) {
          // If memberId is an object with memCk property, extract that value
          validMemberId = (memberId as any).memCk;
          console.warn('[ChatWidget] memberId was passed as object, extracted memCk:', validMemberId);
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
          planId,
          memberType,
        });
        
        await loadChatConfiguration({
          memberId: validMemberId,
          planId,
          memberType,
        });
        
        console.log('[ChatWidget] Chat configuration loaded successfully');
        
        // Try to enable the chat button
        if (typeof window !== 'undefined') {
          setTimeout(enableChatButton, 1000);
          // Try again after a longer delay just to be safe
          setTimeout(enableChatButton, 3000);
        }
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

  console.log('[ChatWidget] Rendering chat widget container with chat mode:', chatMode);

  return (
    <>
      {/* Always add the Genesys script for initialization */}
      <GenesysScript
        userData={userData}
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!}
        onScriptLoaded={() => {
          console.log('[ChatWidget] Genesys script loaded, attempting to enable chat button');
          enableChatButton();
        }}
      />
      
      {/* Render our custom ChatButton component */}
      <ChatButton text="Chat Now" />
      
      {children}
    </>
  );
}
