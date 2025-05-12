'use client';
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { CHAT_ENDPOINTS, getChatConfig } from '@/app/chat/config/endpoints';
import { useChatStore } from '@/app/chat/stores/chatStore';
import {
  logChatConfigDiagnostics,
  validateChatConfig,
} from '@/app/chat/utils/chatDebugger';
import { useEffect, useState } from 'react';
// ChatUI is deprecated and returns null anyway

// Create a ClientOnly wrapper to prevent hydration issues
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

/**
 * ChatScriptLoader - Component that loads Genesys scripts
 * This component handles the loading and initialization of the legacy chat
 * scripts correctly.
 */
function ChatScriptLoader() {
  const chatData = useChatStore((state) => state.chatData);
  const chatSettings = useChatStore((state) => state.chatSettings);
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);
  const [clickToChatLoaded, setClickToChatLoaded] = useState(false);
  const [loadingErrors, setLoadingErrors] = useState<string[]>([]);
  const chatConfig = getChatConfig();

  // Debug chat settings - VERY IMPORTANT
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timestamp = new Date().toISOString();

    // Detailed inspection of chatData to track chatAvailable value
    if (chatData) {
      console.log('[ChatScriptLoader] DETAILED CHAT DATA INSPECTION', {
        timestamp,
        chatAvailable: chatData.chatAvailable,
        chatAvailableType: typeof chatData.chatAvailable,
        isEligible: chatData.isEligible,
        cloudChatEligible: chatData.cloudChatEligible,
        chatDataKeys: Object.keys(chatData),
        chatDataDescriptors: Object.getOwnPropertyDescriptors(chatData),
        source: 'LegacyChatWrapper_INITIAL',
      });
    }

    // Run comprehensive diagnostics on the chat configuration
    if (chatSettings) {
      logChatConfigDiagnostics(chatSettings);
    } else {
      logChatConfigDiagnostics(undefined, undefined, true);
    }

    // Debug environment variables directly
    console.log('[ChatScriptLoader] Environment variables:', {
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT:
        process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT_TYPE:
        typeof process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT_RAW: JSON.stringify(
        process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
      ),
      ENVIRONMENT: chatConfig.ENV_NAME,
      USING_ENDPOINTS: {
        CHAT_SESSION: chatConfig.CLICK_TO_CHAT_ENDPOINT,
        TOKEN: chatConfig.CHAT_TOKEN_ENDPOINT,
        COBROWSE: chatConfig.COBROWSE_LICENSE_ENDPOINT,
      },
      timestamp,
    });

    console.log('ChatSettings from store:', {
      token: chatSettings?.token ? '✓ Present' : '✗ Missing',
      clickToChatEndpoint: chatSettings?.clickToChatEndpoint,
      chatData: chatData
        ? {
            chatGroup: chatData.chatGroup,
            isEligible: chatData.isEligible,
            chatAvailable: chatData.chatAvailable,
            cloudChatEligible: chatData.cloudChatEligible,
            businessHours: chatData.businessHours,
            // Add other properties as needed
          }
        : 'No chat data',
      timestamp,
    });

    // Check for potential URL issues
    if (
      chatSettings?.clickToChatEndpoint &&
      typeof chatSettings.clickToChatEndpoint === 'object'
    ) {
      console.error(
        'ERROR: clickToChatEndpoint is an object, not a string:',
        chatSettings.clickToChatEndpoint,
      );
      setLoadingErrors((prev) => [
        ...prev,
        'clickToChatEndpoint is an object instead of a string',
      ]);
    }
  }, [chatSettings, chatData, chatConfig]);

  // Step 1: Load the core Genesys widgets script first
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('[ChatScriptLoader] Beginning script load sequence');

    try {
      // Get the widgets script path from centralized config
      const WIDGETS_SCRIPT_PATH = CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL;

      // Create and load widgets.min.js directly in the document head
      const widgetsScript = document.createElement('script');
      widgetsScript.src = WIDGETS_SCRIPT_PATH;
      widgetsScript.async = false; // Load this synchronously
      widgetsScript.id = 'genesys-widgets-script';

      widgetsScript.onload = () => {
        console.log('[ChatScriptLoader] widgets.min.js loaded successfully');
        setWidgetsLoaded(true);
      };

      widgetsScript.onerror = (error) => {
        const errorMsg = `Failed to load widgets.min.js from ${WIDGETS_SCRIPT_PATH}`;
        console.error('[ChatScriptLoader] ' + errorMsg, error);
        setLoadingErrors((prev) => [...prev, errorMsg]);
      };

      // Add the script to the document
      if (!document.getElementById('genesys-widgets-script')) {
        document.head.appendChild(widgetsScript);
      }
    } catch (error) {
      const errorMsg = `Exception loading widgets.min.js: ${error}`;
      console.error('[ChatScriptLoader] ' + errorMsg);
      setLoadingErrors((prev) => [...prev, errorMsg]);
    }

    // Clean up on unmount
    return () => {
      const script = document.getElementById('genesys-widgets-script');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Step 2: Once widgets script is loaded, load the click_to_chat.js
  useEffect(() => {
    if (!widgetsLoaded || typeof window === 'undefined') return;

    console.log('[ChatScriptLoader] Loading click_to_chat.js');

    try {
      // Get the script path from centralized config
      const CLICK_TO_CHAT_PATH = CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL;

      // First, initialize chat settings object BEFORE loading click_to_chat.js
      // Use string values for everything to avoid object serialization issues
      const endpoint =
        chatConfig.CLICK_TO_CHAT_ENDPOINT ||
        chatSettings?.clickToChatEndpoint ||
        CHAT_ENDPOINTS.CHAT_SESSION_ENDPOINT;

      console.log('[ChatScriptLoader] Using endpoint:', endpoint);

      // IMPORTANT: Check chatAvailable instead of cloudChatEligible for button eligibility
      // Check both chatData.chatAvailable and chatData.isEligible
      const isChatAvailable = !!(
        chatData?.chatAvailable || chatData?.isEligible
      );

      // Double check all relevant properties
      console.log('[ChatScriptLoader] Chat availability status (DETAILED):', {
        chatAvailable: chatData?.chatAvailable,
        chatAvailableType: typeof chatData?.chatAvailable,
        isEligible: chatData?.isEligible,
        cloudChatEligible: chatData?.cloudChatEligible,
        finalDecision: isChatAvailable ? 'AVAILABLE' : 'NOT AVAILABLE',
        chatData: JSON.stringify(chatData),
      });

      (window as any).chatSettings = {
        isChatEligibleMember: isChatAvailable ? 'true' : 'false', // Use corrected eligibility check
        isChatAvailable: isChatAvailable ? 'true' : 'false', // Use corrected eligibility check
        isDemoMember: 'true',
        chatGroup:
          typeof chatData?.chatGroup === 'string'
            ? chatData.chatGroup
            : 'Default',
        formattedFirstName: 'Member',
        memberLastName: 'User',
        // Ensure token and clickToChatEndpoint are strings
        clickToChatToken:
          typeof chatSettings?.token === 'string' ? chatSettings.token : '',
        clickToChatEndpoint: endpoint,
        opsPhone: '1-800-123-4567',
        opsPhoneHours: '24/7',
        chatHours: '24/7',
        rawChatHours: 'S_S_24',
        isMedical: 'true',
        isDental: 'false',
        isVision: 'false',
      };

      // Run validation on the window.chatSettings object
      const validationResult = validateChatConfig(
        chatSettings || undefined,
        (window as any).chatSettings,
      );

      console.log(
        '[ChatScriptLoader] Chat settings validation:',
        validationResult,
      );

      if (!validationResult.isValid) {
        console.warn('[ChatScriptLoader] Chat settings validation issues:', {
          missingRequired: validationResult.missingRequired,
          warnings: validationResult.warnings,
        });
      }

      console.log(
        '[ChatScriptLoader] Chat settings initialized:',
        (window as any).chatSettings,
      );

      // Now load the click_to_chat.js script
      const clickToChatScript = document.createElement('script');
      clickToChatScript.src = CLICK_TO_CHAT_PATH;
      clickToChatScript.async = false; // Load this synchronously too
      clickToChatScript.id = 'genesys-click-to-chat-script';

      clickToChatScript.onload = () => {
        console.log('[ChatScriptLoader] click_to_chat.js loaded successfully');
        setClickToChatLoaded(true);
      };

      clickToChatScript.onerror = (error) => {
        const errorMsg = `Failed to load click_to_chat.js from ${CLICK_TO_CHAT_PATH}`;
        console.error('[ChatScriptLoader] ' + errorMsg, error);
        setLoadingErrors((prev) => [...prev, errorMsg]);
      };

      // Add the script to the document
      if (!document.getElementById('genesys-click-to-chat-script')) {
        document.head.appendChild(clickToChatScript);
      }
    } catch (error) {
      const errorMsg = `Exception loading click_to_chat.js: ${error}`;
      console.error('[ChatScriptLoader] ' + errorMsg);
      setLoadingErrors((prev) => [...prev, errorMsg]);
    }

    // Clean up on unmount
    return () => {
      const script = document.getElementById('genesys-click-to-chat-script');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [widgetsLoaded, chatData, chatSettings, chatConfig]);

  // Step 3: Create the chat button if needed
  useEffect(() => {
    if (!clickToChatLoaded || typeof window === 'undefined') return;

    console.log('[ChatScriptLoader] Initializing chat button');

    // Give time for scripts to initialize
    const timeoutId = setTimeout(() => {
      // Force enable the chat button if chatAvailable is true (not cloudChatEligible)
      const shouldEnableButton = !!(
        chatData?.chatAvailable || chatData?.isEligible
      );

      console.log('[ChatScriptLoader] Should enable button? (DETAILED)', {
        chatAvailable: chatData?.chatAvailable,
        chatAvailableType: typeof chatData?.chatAvailable,
        isEligible: chatData?.isEligible,
        chatDataKeys: chatData ? Object.keys(chatData) : [],
        forceEnabled: window._FORCE_CHAT_AVAILABLE,
        decision: shouldEnableButton ? 'YES' : 'NO',
      });

      if (shouldEnableButton || window._FORCE_CHAT_AVAILABLE) {
        if (typeof (window as any).enableChatButton === 'function') {
          try {
            console.log('[ChatScriptLoader] Calling enableChatButton()');
            (window as any).enableChatButton();
          } catch (error) {
            console.error(
              '[ChatScriptLoader] Error calling enableChatButton:',
              error,
            );
            createFallbackButton();
          }
        } else {
          console.warn(
            '[ChatScriptLoader] enableChatButton function not found',
          );
          createFallbackButton();
        }
      } else {
        console.log(
          '[ChatScriptLoader] Chat is not available, not enabling button',
        );
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [clickToChatLoaded, chatData]);

  // Function to create a fallback button if needed
  function createFallbackButton() {
    console.log('[ChatScriptLoader] Creating fallback button');
    if (document.querySelector('#debug-chat-btn')) return;

    const button = document.createElement('button');
    button.id = 'debug-chat-btn';
    button.textContent = 'Chat Now';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.bottom = '20px';
    button.style.backgroundColor = '#0078d4';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    button.onclick = function () {
      if (typeof (window as any).openGenesysChat === 'function') {
        (window as any).openGenesysChat();
      } else {
        alert(
          'Chat service is being configured. Please try again in a moment.',
        );
      }
    };

    document.body.appendChild(button);
    console.log('[ChatScriptLoader] Fallback button created');
  }

  // Show loading errors if any
  if (loadingErrors.length > 0) {
    return (
      <div style={{ display: 'none' }}>
        {/* Hidden debugging div */}
        <div
          id="chat-loading-errors"
          data-errors={JSON.stringify(loadingErrors)}
        />
      </div>
    );
  }

  return null; // This component doesn't render anything visible
}

/**
 * Legacy chat implementation wrapper
 * Handles loading Genesys chat scripts and creating chat button
 */
export function LegacyChatWrapper() {
  // The stylesheet is imported at the top of the file, no need for link tag
  return (
    <>
      <div id="genesys-chat-container"></div>
      <ClientOnly>
        <ChatScriptLoader />
      </ClientOnly>
    </>
  );
}

export default LegacyChatWrapper;
