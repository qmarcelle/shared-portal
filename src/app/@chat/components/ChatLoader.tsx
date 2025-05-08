'use client';
import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import BusinessHoursBanner from './BusinessHoursBanner';
import ChatControls from './ChatControls';
import { ChatPersistence } from './ChatPersistence';
import ChatSession from './ChatSession';
import { ChatWidget } from './ChatWidget';
import CloudChatWrapper from './CloudChatWrapper';
import LegacyChatWrapper from './LegacyChatWrapper';
import PlanInfoHeader from './PlanInfoHeader';
import PlanSwitcherButton from './PlanSwitcherButton';
import TermsAndConditions from './TermsAndConditions';

interface ChatLoaderProps {
  memberId: number | string; // Allow for string values
  planId: string;
  memberType?: string;
}

/**
 * Main chat loader component that:
 * - Loads chat configuration on mount
 * - Sets up chat event handlers
 * - Renders the appropriate chat UI based on state
 */
export default function ChatLoader({
  memberId,
  planId,
  memberType = 'byMemberCk',
}: ChatLoaderProps) {
  const {
    loadChatConfiguration,
    isChatActive,
    isEligible,
    isOOO,
    chatMode,
    isLoading,
    error,
    chatGroup,
    businessHoursText,
  } = useChatStore();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const componentId = Math.random().toString(36).substring(2, 10);
  
  // Add a state for handling load attempts
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Log component rendering and state including raw props
  useEffect(() => {
    // This will be visible in browser console with full details
    console.log('[ChatLoader] Component rendered with props:', { 
      rawMemberId: memberId,
      rawPlanId: planId, 
      rawMemberType: memberType,
      memberIdType: typeof memberId,
      planIdType: typeof planId
    });
    
    // This will go to the logger (might not be visible in browser console)
    logger.info('[ChatLoader] Component rendered', {
      componentId,
      memberId,
      planId,
      memberType,
      isLoading,
      isInitializing: initializing,
      isEligible,
      isOOO,
      chatMode,
      hasError: !!error,
      scriptLoaded,
      chatGroup,
      loadAttempts,
    });
  }, [memberId, planId, memberType, initializing, isLoading, isEligible, isOOO, chatMode, error, scriptLoaded, chatGroup, componentId, loadAttempts]);

  // Detect when Genesys script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Client-side console log for immediate visibility
    console.log('[ChatLoader] Window globals check:', {
      windowHasGenesys: typeof window.Genesys !== 'undefined',
      windowHasGenesysUnderscore: typeof window._genesys !== 'undefined',
      globalKeys: Object.keys(window).filter(key => 
        key.toLowerCase().includes('genesys') || 
        key.toLowerCase().includes('chat') ||
        key.toLowerCase().includes('widget')
      )
    });
    
    // Log window global state for debug
    logger.info('[ChatLoader] Window globals check', {
      componentId,
      windowHasGenesys: typeof window.Genesys !== 'undefined',
      windowHasGenesysUnderscore: typeof window._genesys !== 'undefined',
      allGlobalKeys: Object.keys(window).filter(key => 
        key.toLowerCase().includes('genesys') || 
        key.toLowerCase().includes('chat') ||
        key.toLowerCase().includes('widget')
      )
    });
    
    const checkGenesysLoaded = () => {
      // For legacy chat, we need to check if ANY of these globals exist
      const legacyLoaded = typeof window._genesys !== 'undefined' || 
                          typeof window.Genesys !== 'undefined' ||
                          typeof window.GenesysWidget !== 'undefined' ||
                          typeof window.ChatWidget !== 'undefined';
      
      // For cloud chat, check for Genesys object
      const cloudLoaded = typeof window.Genesys !== 'undefined';
      
      // Client-side console log for immediate visibility
      console.log('[ChatLoader] Checking Genesys script status:', {
        chatMode,
        legacyLoaded,
        cloudLoaded,
      });
      
      // Log what we're checking for
      logger.info('[ChatLoader] Checking Genesys script status', {
        componentId,
        chatMode,
        legacyLoaded,
        cloudLoaded,
        cloudScriptExists: typeof window.Genesys !== 'undefined',
        legacyScriptExists: typeof window._genesys !== 'undefined',
        genesysWidgetExists: typeof window.GenesysWidget !== 'undefined',
        chatWidgetExists: typeof window.ChatWidget !== 'undefined'
      });
      
      // Check based on chat mode (cloud or legacy)
      if ((chatMode === 'cloud' && cloudLoaded) || 
          (chatMode === 'legacy' && legacyLoaded)) {
        logger.info('[ChatLoader] Genesys script loaded successfully', {
          componentId,
          chatMode,
        });
        setScriptLoaded(true);
        return true;
      }
      return false;
    };
    
    // Check immediately if already loaded
    if (checkGenesysLoaded()) return;
    
    // Check periodically until loaded
    const interval = setInterval(() => {
      if (checkGenesysLoaded()) {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [chatMode, componentId]);

  // Load chat configuration on mount
  useEffect(() => {
    const initializeChat = async () => {
      // Client-side console log for immediate visibility
      console.log('[ChatLoader] Initializing chat configuration with:', {
        memberId,
        planId,
        memberType,
        attemptNumber: loadAttempts + 1
      });
      
      logger.info('[ChatLoader] Initializing chat configuration', {
        componentId,
        memberId,
        planId,
        memberType,
        loadAttempt: loadAttempts + 1
      });
      
      try {
        // Convert memberId to number if it's a string to match the function parameter type
        await loadChatConfiguration(
          typeof memberId === 'string' ? parseInt(memberId, 10) : memberId,
          planId,
          memberType
        );
        
        console.log('[ChatLoader] Chat configuration loaded successfully');
        logger.info('[ChatLoader] Chat configuration loaded', {
          componentId,
          success: true,
        });
      } catch (err) {
        console.error('[ChatLoader] Failed to load chat configuration:', err);
        logger.error('[ChatLoader] Failed to load chat configuration', {
          componentId,
          error: err instanceof Error ? err.message : 'Unknown error',
          errorStack: err instanceof Error ? err.stack : undefined,
        });
        
        // Increment load attempt counter for retry logic
        setLoadAttempts(prev => prev + 1);
      } finally {
        // Hide initialization state after config load attempt
        setTimeout(() => {
          console.log('[ChatLoader] Initialization complete');
          logger.info('[ChatLoader] Initialization complete', {
            componentId,
            initializing: false,
          });
          setInitializing(false);
        }, 500);
      }
    };
    
    initializeChat();
  }, [memberId, planId, memberType, loadChatConfiguration, componentId, loadAttempts]);

  // Show loading state until both our data is loaded and script is ready
  if (isLoading || initializing || (chatMode && !scriptLoaded)) {
    const loadingState = {
      isLoading,
      initializing,
      chatMode,
      scriptLoaded,
    };
    
    console.log('[ChatLoader] Showing loading state:', loadingState);
    logger.info('[ChatLoader] Showing loading state', {
      componentId,
      ...loadingState,
      showingLoader: true,
    });
    
    return (
      <div role="status" aria-live="polite" className="chat-loading-indicator flex items-center p-4">
        <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {initializing ? 'Initializing chat...' : 'Loading chat...'}
        <span className="ml-2 text-xs text-gray-500">({loadAttempts > 0 ? `Attempt ${loadAttempts+1}` : 'First attempt'})</span>
      </div>
    );
  }

  // Handle error state with retry option
  if (error) {
    console.log('[ChatLoader] Showing error state:', error);
    logger.info('[ChatLoader] Showing error state', {
      componentId,
      errorMessage: error?.message || 'Unknown error',
    });
    
    return (
      <div role="alert" aria-live="assertive" className="p-4 bg-gray-100 rounded-md">
        <p className="text-gray-700 mb-2">
          {typeof error === 'string'
            ? error
            : error?.message || 'An error occurred loading chat.'}
        </p>
        <button 
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            console.log('[ChatLoader] Retry button clicked');
            setLoadAttempts(prev => prev + 1);
            loadChatConfiguration(
              typeof memberId === 'string' ? parseInt(memberId, 10) : memberId, 
              planId, 
              memberType
            );
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle not eligible state
  if (!isEligible) {
    console.log('[ChatLoader] Member not eligible for chat');
    logger.info('[ChatLoader] Member not eligible for chat', {
      componentId,
      isEligible,
    });
    
    return (
      <div role="alert" aria-live="assertive" className="p-4 bg-gray-50">
        <p className="font-medium">Chat is not available for your plan.</p>
        <p className="text-sm mt-1 text-gray-600">
          This could be due to plan restrictions or configuration settings.
        </p>
      </div>
    );
  }

  // Handle out-of-office hours state
  if (isOOO) {
    console.log('[ChatLoader] Chat is outside business hours');
    logger.info('[ChatLoader] Chat is outside business hours', {
      componentId,
      isOOO,
      businessHoursText,
    });
    
    return (
      <div role="alert" aria-live="assertive" className="p-4 bg-gray-50">
        <p className="font-medium">Chat is currently closed.</p>
        {businessHoursText && <p className="text-sm mt-1 text-gray-600">{businessHoursText}</p>}
      </div>
    );
  }

  // If we reach here, all conditions are met to show the chat
  console.log('[ChatLoader] Rendering chat UI:', {
    chatMode,
    isChatActive,
    chatGroup
  });
  
  logger.info('[ChatLoader] Rendering chat UI', {
    componentId,
    chatMode,
    isChatActive,
    chatGroup,
  });

  return (
    <ChatWidget 
      memberId={memberId} 
      planId={planId} 
      memberType={memberType}
      forceEnable={true} // Force enable the chat widget regardless of eligibility or OOO status
    >
      <ChatPersistence />

      {/* Pre-chat UI */}
      {!isChatActive && isEligible && !isOOO && (
        <div className="pre-chat-ui">
          <PlanInfoHeader />
          <PlanSwitcherButton />
          <TermsAndConditions />
        </div>
      )}

      {/* Show debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 p-2 text-xs">
          <p>Debug: ChatMode={chatMode}, ChatGroup={chatGroup || 'none'}</p>
        </div>
      )}

      {/* Load appropriate chat widget based on mode */}
      {chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />}

      {/* In-chat UI */}
      {isChatActive && (
        <>
          <BusinessHoursBanner />
          <ChatControls />
          <ChatSession />
        </>
      )}
    </ChatWidget>
  );
}
