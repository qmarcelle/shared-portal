// @ts-nocheck
'use client';
// Remove direct import of CSS - we'll load it dynamically
// import '@/../public/assets/genesys/plugins/widgets.min.css';
import { CHAT_ENDPOINTS, getChatConfig } from '@/app/chat/config/endpoints';
import { useChatStore } from '@/app/chat/stores/chatStore';
import {
  logChatConfigDiagnostics,
  validateChatConfig,
} from '@/app/chat/utils/chatDebugger';
import {
  applyCriticalChatButtonStyles,
  createEmergencyChatButton,
  ensureChatCssIsLoaded,
} from '@/app/chat/utils/chatUtils';
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

  // NEW: Add diagnostic effect for script paths
  useEffect(() => {
    console.log('[DIAGNOSTIC] Script paths:', {
      widgetsPath: CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL,
      clickToChatPath: CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL,
      envWidgetUrl: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL,
      genesysBootstrapUrl: process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
      dynamicPath: `${CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL}?cb=${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Debug chat settings - VERY IMPORTANT
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use our enhanced CSS loading function
    ensureChatCssIsLoaded();

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

  // Step 1: Load the core Genesys widgets script first - SIMPLIFIED DIRECT APPROACH
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log(
      '[ChatScriptLoader] Beginning script load sequence with direct path approach',
    );

    try {
      // Use direct path reference instead of dynamic configuration
      const widgetsScript = document.createElement('script');
      widgetsScript.src =
        '/assets/genesys/plugins/widgets.min.js?cb=' + Date.now(); // Direct path with cache-busting
      widgetsScript.async = false; // Load this synchronously
      widgetsScript.id = 'genesys-widgets-script';

      // Log more details for debugging
      console.log('[ChatScriptLoader] Creating widgets script with:', {
        src: widgetsScript.src,
        async: widgetsScript.async,
        id: widgetsScript.id,
        timestamp: new Date().toISOString(),
      });

      widgetsScript.onload = () => {
        console.log(
          '[ChatScriptLoader] widgets.min.js loaded successfully with direct path',
        );
        // Check if _genesys object was created as expected
        console.log('[ChatScriptLoader] _genesys object status:', {
          exists: typeof window._genesys !== 'undefined',
          hasWidgets: typeof window._genesys?.widgets !== 'undefined',
          timestamp: new Date().toISOString(),
        });
        setWidgetsLoaded(true);
      };

      widgetsScript.onerror = (error) => {
        const errorMsg = `Failed to load widgets.min.js from direct path - check file existence`;
        console.error('[ChatScriptLoader] ' + errorMsg, error);
        setLoadingErrors((prev) => [...prev, errorMsg]);
      };

      // Check if script already exists before adding
      if (!document.getElementById('genesys-widgets-script')) {
        document.head.appendChild(widgetsScript);
        console.log(
          '[ChatScriptLoader] widgets.min.js script tag added to document head',
        );
      } else {
        console.log(
          '[ChatScriptLoader] widgets.min.js script tag already exists, not adding duplicate',
        );
      }
    } catch (error) {
      const errorMsg = `Exception loading widgets.min.js with direct path: ${error}`;
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

    console.log(
      '[ChatScriptLoader] Loading click_to_chat.js with direct path approach',
    );

    try {
      // Use direct path reference instead of dynamic configuration
      const CLICK_TO_CHAT_PATH =
        '/assets/genesys/click_to_chat.js?cb=' + Date.now();

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

      // Log more details for debugging
      console.log('[ChatScriptLoader] Creating click_to_chat script with:', {
        src: clickToChatScript.src,
        async: clickToChatScript.async,
        id: clickToChatScript.id,
        timestamp: new Date().toISOString(),
      });

      clickToChatScript.onload = () => {
        console.log(
          '[ChatScriptLoader] click_to_chat.js loaded successfully with direct path',
        );
        setClickToChatLoaded(true);
      };

      clickToChatScript.onerror = (error) => {
        const errorMsg = `Failed to load click_to_chat.js from direct path`;
        console.error('[ChatScriptLoader] ' + errorMsg, error);
        setLoadingErrors((prev) => [...prev, errorMsg]);
      };

      // Check if script already exists before adding
      if (!document.getElementById('genesys-click-to-chat-script')) {
        document.head.appendChild(clickToChatScript);
        console.log(
          '[ChatScriptLoader] click_to_chat.js script tag added to document head',
        );
      } else {
        console.log(
          '[ChatScriptLoader] click_to_chat.js script tag already exists, not adding duplicate',
        );
      }
    } catch (error) {
      const errorMsg = `Exception loading click_to_chat.js with direct path: ${error}`;
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

    // Add custom CSS to ensure chat button visibility
    // Use our enhanced function instead of inline styles
    applyCriticalChatButtonStyles();

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
            createEmergencyChatButton();
          }
        } else {
          console.warn(
            '[ChatScriptLoader] enableChatButton function not found',
          );
          createEmergencyChatButton();
        }
      } else {
        console.log(
          '[ChatScriptLoader] Chat is not available, not enabling button',
        );
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [clickToChatLoaded, chatData]);

  // NEW: Additional delayed DOM check to ensure button visibility - using staggered timeouts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Define the check function
    const checkAndFixButton = () => {
      // Look for Genesys chat button
      const genesysButton = document.querySelector('.cx-webchat-chat-button');
      const debugButton = document.querySelector('#debug-chat-button');

      console.log('[ChatScriptLoader] DOM Check: Looking for chat buttons', {
        genesysButtonFound: !!genesysButton,
        debugButtonFound: !!debugButton,
        chatAvailable: chatData?.chatAvailable,
        forceEnabled: window._FORCE_CHAT_AVAILABLE,
        timestamp: new Date().toISOString(),
      });

      if (genesysButton) {
        console.log(
          '[ChatScriptLoader] DOM Check: Found Genesys button, ensuring visibility',
        );
        genesysButton.setAttribute(
          'style',
          'display: flex !important; opacity: 1 !important; visibility: visible !important; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: fixed; right: 20px; bottom: 20px; z-index: 9999;',
        );
        return true;
      } else if (debugButton) {
        console.log(
          '[ChatScriptLoader] DOM Check: Found debug button, ensuring visibility',
        );
        debugButton.setAttribute(
          'style',
          'display: block !important; opacity: 1 !important; visibility: visible !important; position: fixed; right: 20px; bottom: 20px; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 9999;',
        );
        return true;
      }

      return false;
    };

    // Run multiple checks with increasing timeouts
    const checkTimes = [2000, 5000, 10000]; // Check at 2s, 5s, and 10s
    const timeoutIds: NodeJS.Timeout[] = [];

    checkTimes.forEach((delay) => {
      const timeoutId = setTimeout(() => {
        console.log(
          `[ChatScriptLoader] DOM Check: Running at ${delay}ms delay`,
        );
        const found = checkAndFixButton();

        // If this is the final check and we still don't have a button, create one
        if (!found && delay === checkTimes[checkTimes.length - 1]) {
          console.warn(
            '[ChatScriptLoader] DOM Check: No button found after all checks, creating fallback',
          );
          createEmergencyChatButton();
        }
      }, delay);

      timeoutIds.push(timeoutId);
    });

    // Clean up all timeouts on unmount
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [chatData, clickToChatLoaded]);

  // Function to create a fallback button if needed
  function createFallbackButton() {
    console.log('[ChatScriptLoader] Creating fallback button');

    // Check if a debug button already exists with any of our possible IDs
    if (document.querySelector('#debug-chat-btn, #debug-chat-button')) {
      console.log(
        '[ChatScriptLoader] Debug button already exists, ensuring visibility',
      );
      const existingButton = document.querySelector(
        '#debug-chat-btn, #debug-chat-button',
      ) as HTMLElement;
      if (existingButton) {
        // Force button to be visible with !important styles
        existingButton.style.cssText = [
          'display: block !important',
          'opacity: 1 !important',
          'visibility: visible !important',
          'position: fixed !important',
          'right: 20px !important',
          'bottom: 20px !important',
          'background-color: #0078d4 !important',
          'color: white !important',
          'padding: 10px 20px !important',
          'border-radius: 4px !important',
          'cursor: pointer !important',
          'box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important',
          'z-index: 99999 !important', // Extra high z-index
        ].join('; ');
        return;
      }
    }

    // Create a new button with a unique container to isolate it from CSS
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'chat-button-container';

    // Apply isolation styles to the container
    buttonContainer.style.cssText = [
      'position: static !important',
      'display: block !important',
      'contain: content !important', // CSS containment to prevent inheritance
      'z-index: 99999 !important', // Ensure it's above everything
    ].join('; ');

    const button = document.createElement('button');
    button.id = 'debug-chat-btn';
    button.textContent = 'Chat Now';

    // Apply comprehensive styles with !important to prevent overrides
    button.style.cssText = [
      'display: block !important',
      'opacity: 1 !important',
      'visibility: visible !important',
      'position: fixed !important',
      'right: 20px !important',
      'bottom: 20px !important',
      'background-color: #0078d4 !important',
      'color: white !important',
      'padding: 10px 20px !important',
      'border-radius: 4px !important',
      'cursor: pointer !important',
      'box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important',
      'font-family: sans-serif !important',
      'font-size: 16px !important',
      'font-weight: bold !important',
      'border: none !important',
      'z-index: 99999 !important', // Extra high z-index
      'pointer-events: auto !important', // Ensure clicks work
    ].join('; ');

    button.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[ChatScriptLoader] Debug button clicked');

      // Always use our universal chat opener that handles all cases
      (window as any).openGenesysChat();
      return false;
    };

    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
    console.log(
      '[ChatScriptLoader] Fallback button created and appended to body',
    );
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
  // Add a first-render effect to ensure CSS is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Force CSS loading immediately on component mount
    ensureChatCssIsLoaded();

    // Set a short timeout to apply critical styles
    setTimeout(applyCriticalChatButtonStyles, 500);

    // Set a longer timeout to check if button exists, otherwise create one
    setTimeout(() => {
      const chatButton = document.querySelector('.cx-webchat-chat-button');
      if (!chatButton) {
        console.log(
          '[LegacyChatWrapper] No chat button found after timeout, creating emergency button',
        );
        createEmergencyChatButton();
      }
    }, 5000);
  }, []);

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

// Instead of declaring global types (which causes conflicts), add debug utility
// immediately after component definition
const setupChatDebugger = () => {
  if (typeof window === 'undefined') return;

  // Add a global debug function that can be called from browser console
  (window as any).debugChatButton = function () {
    console.log('[GLOBAL] Chat debug information:', {
      genesysButton: document.querySelector('.cx-webchat-chat-button')
        ? 'Found'
        : 'Not found',
      debugButton: document.querySelector('#debug-chat-btn')
        ? 'Found'
        : 'Not found',
      _genesys: !!window._genesys,
      hasWebchatModule: !!(window as any)._genesys?.widgets?.webchat,
      CXBus: !!(window as any).CXBus,
      CXBusCommand: typeof (window as any).CXBus?.command === 'function',
      openGenesysChat: typeof (window as any).openGenesysChat === 'function',
      _FORCE_CHAT_AVAILABLE: (window as any)._FORCE_CHAT_AVAILABLE,
      chatSettings: (window as any).chatSettings ? 'Present' : 'Missing',
      enableChatButton: typeof (window as any).enableChatButton === 'function',
      timestamp: new Date().toISOString(),
    });

    return 'Debug information logged to console. Check for DOM button presence and JS functions.';
  };

  // Also create a function to force show the chat button
  (window as any).forceShowChatButton = function () {
    return createEmergencyChatButton();
  };

  console.log(
    '[ChatDebugger] Debug utilities added to window. Try window.debugChatButton() or window.forceShowChatButton()',
  );
};

// Run the setup immediately
if (typeof window !== 'undefined') {
  setupChatDebugger();

  // IMPORTANT: Force chat button to be available regardless of server settings
  (window as any)._FORCE_CHAT_AVAILABLE = true;
  console.log(
    '[GLOBAL] Force enabled chat button with _FORCE_CHAT_AVAILABLE = true',
  );

  // Get the chat endpoints properly using import instead of require
  let CHAT_ENDPOINT_PATHS = {
    WIDGETS_SCRIPT_URL: '/assets/genesys/plugins/widgets.min.js',
    CLICK_TO_CHAT_SCRIPT_URL: '/assets/genesys/click_to_chat.js',
    WIDGETS_CSS_URL: '/assets/genesys/plugins/widgets.min.css',
  };

  // Try to use the actual imported endpoints
  try {
    if (CHAT_ENDPOINTS) {
      CHAT_ENDPOINT_PATHS = {
        WIDGETS_SCRIPT_URL:
          CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL ||
          CHAT_ENDPOINT_PATHS.WIDGETS_SCRIPT_URL,
        CLICK_TO_CHAT_SCRIPT_URL:
          CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL ||
          CHAT_ENDPOINT_PATHS.CLICK_TO_CHAT_SCRIPT_URL,
        WIDGETS_CSS_URL: '/assets/genesys/plugins/widgets.min.css', // Hardcoded as it might not be in CHAT_ENDPOINTS
      };
      console.log(
        '[GLOBAL] Using centralized chat endpoints',
        CHAT_ENDPOINT_PATHS,
      );
    }
  } catch (e) {
    console.warn(
      '[GLOBAL] Could not use centralized endpoints, using defaults',
      e,
    );
  }

  // Add a universal chat opener function that works reliably
  (window as any).openGenesysChat = function () {
    console.log('[GLOBAL] openGenesysChat called');

    try {
      // First try CXBus command
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        console.log('[GLOBAL] Opening chat via CXBus.command');
        return window.CXBus.command('WebChat.open', {
          form: {
            autoSubmit: true,
          },
        });
      }

      // Then try CXBus publish
      if (window.CXBus && typeof window.CXBus.publish === 'function') {
        console.log('[GLOBAL] Opening chat via CXBus.publish');
        return window.CXBus.publish('WebChat.open');
      }

      // Try direct _genesys access
      if (window._genesys?.widgets?.webchat) {
        console.log('[GLOBAL] Opening chat via _genesys.widgets.webchat');
        return window._genesys.widgets.webchat.open();
      }

      console.warn('[GLOBAL] No chat methods available to open chat');
      return false;
    } catch (error) {
      console.error('[GLOBAL] Error opening chat:', error);
      return false;
    }
  };

  // Add our CSS fix function
  (window as any).fixChatButtonCSS = function () {
    console.log('[GLOBAL] Running chat button CSS fix');
    return ensureChatCssIsLoaded();
  };

  console.log(
    '[GLOBAL] Added fixChatButtonCSS() function to window. Run window.fixChatButtonCSS() to fix styling issues.',
  );

  // Configure chat if _genesys already exists
  setTimeout(() => {
    if (window._genesys && window._genesys.widgets) {
      console.log('[GLOBAL] Configuring Genesys widgets after timeout');
      window._genesys.widgets.onReady = function () {
        console.log('[GLOBAL] Genesys widgets are ready');

        // Force enable chat
        if (window._genesys.widgets.webchat) {
          window._genesys.widgets.webchat.chatButton = {
            enabled: true,
            template:
              '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
            effect: 'fade',
            openDelay: 100,
            effectDuration: 200,
            hideDuringInvite: false,
          };

          console.log('[GLOBAL] Chat button configured');
        }
      };
    }
  }, 2000);
}
