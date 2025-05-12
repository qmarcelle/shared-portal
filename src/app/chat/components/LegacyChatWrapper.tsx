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

    // Ensure CSS is loaded properly by adding it directly to the head
    // This addresses the "preloaded but not used" warning
    const ensureCssIsLoaded = () => {
      const cssPath = '/assets/genesys/plugins/widgets.min.css';
      const existingLink = document.querySelector(`link[href="${cssPath}"]`);

      if (!existingLink) {
        console.log('[ChatScriptLoader] Adding CSS link element to head');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        link.id = 'genesys-widgets-css';

        // Add onload and onerror handlers for debugging
        link.onload = () =>
          console.log('[ChatScriptLoader] CSS loaded successfully');
        link.onerror = () => {
          console.error('[ChatScriptLoader] Failed to load CSS');
          setLoadingErrors((prev) => [
            ...prev,
            'Failed to load widgets.min.css',
          ]);
        };

        document.head.appendChild(link);
      } else {
        console.log('[ChatScriptLoader] CSS link already exists');
      }
    };

    // Ensure CSS is loaded properly
    ensureCssIsLoaded();

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

    // Add custom CSS to ensure chat button visibility
    const addCustomChatButtonStyles = () => {
      // Check if our custom styles already exist
      if (document.getElementById('genesys-custom-styles')) {
        return;
      }

      console.log('[ChatScriptLoader] Adding custom button styles');
      const styleEl = document.createElement('style');
      styleEl.id = 'genesys-custom-styles';
      styleEl.textContent = `
        /* Ensure chat button is visible */
        .cx-webchat-chat-button {
          display: flex !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
          z-index: 9999 !important;
          background-color: #0078d4 !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
          font-family: sans-serif !important;
          font-size: 16px !important;
          font-weight: bold !important;
          text-align: center !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 100px !important;
          min-height: 40px !important;
          transition: all 0.2s ease !important;
        }
        
        .cx-webchat-chat-button:hover {
          background-color: #005a9e !important;
        }
        
        /* Ensure chat window appears correctly */
        .cx-widget.cx-webchat-1 {
          z-index: 10000 !important;
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(styleEl);
    };

    // Add the custom styles immediately
    addCustomChatButtonStyles();

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
          createFallbackButton();
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

      if (typeof (window as any).openGenesysChat === 'function') {
        console.log('[ChatScriptLoader] Calling openGenesysChat()');
        (window as any).openGenesysChat();
      } else if (window.CXBus && typeof window.CXBus.command === 'function') {
        console.log('[ChatScriptLoader] Calling CXBus.command("WebChat.open")');
        window.CXBus.command('WebChat.open');
      } else {
        console.warn('[ChatScriptLoader] No chat open function found');
        alert(
          'Chat service is being configured. Please try again in a moment.',
        );
      }
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
    const createButton =
      (window as any).createFallbackButton ||
      function () {
        const btn = document.createElement('button');
        btn.id = 'manual-debug-chat-btn';
        btn.innerHTML = 'FORCE CHAT';
        btn.style.cssText = [
          'position: fixed',
          'bottom: 20px',
          'right: 20px',
          'z-index: 999999',
          'background: red',
          'color: white',
          'padding: 10px 20px',
          'font-weight: bold',
          'border-radius: 4px',
          'cursor: pointer',
        ].join(';');

        btn.onclick = function () {
          if (typeof (window as any).openGenesysChat === 'function') {
            (window as any).openGenesysChat();
          } else if (
            (window as any).CXBus &&
            typeof (window as any).CXBus.command === 'function'
          ) {
            (window as any).CXBus.command('WebChat.open');
          } else {
            alert('No chat functions available');
          }
        };

        document.body.appendChild(btn);
        return 'Emergency button added';
      };

    return createButton();
  };

  console.log(
    '[ChatDebugger] Debug utilities added to window. Try window.debugChatButton() or window.forceShowChatButton()',
  );
};

// Run the setup immediately
if (typeof window !== 'undefined') {
  setupChatDebugger();

  // Add a CSS troubleshooting function
  (window as any).fixChatButtonCSS = function () {
    console.log('[GLOBAL] Running chat button CSS fix');

    // Force reload the CSS
    const cssPath = '/assets/genesys/plugins/widgets.min.css';
    let link = document.querySelector(
      `link[href="${cssPath}"]`,
    ) as HTMLLinkElement;

    if (link) {
      console.log('[GLOBAL] Removing existing CSS link');
      link.parentNode?.removeChild(link);
    }

    console.log('[GLOBAL] Adding new CSS link');
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssPath + '?t=' + Date.now(); // Add cache buster
    document.head.appendChild(link);

    // Add direct styles for the chat button
    console.log('[GLOBAL] Adding direct button styles');
    setTimeout(() => {
      const button = document.querySelector(
        '.cx-webchat-chat-button',
      ) as HTMLElement;
      if (button) {
        button.style.cssText = `
          display: flex !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
          z-index: 9999 !important;
          background-color: #0078d4 !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
          font-family: sans-serif !important;
          font-size: 16px !important;
          font-weight: bold !important;
        `;
        console.log('[GLOBAL] Direct styles applied to button');
        return 'Button found and styles applied';
      } else {
        console.log('[GLOBAL] Button not found, creating fallback');
        // Create an emergency button
        const btn = document.createElement('button');
        btn.id = 'emergency-chat-button';
        btn.textContent = 'CHAT NOW';
        btn.style.cssText = `
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 99999;
          background-color: #ff4500;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        btn.onclick = function () {
          if (typeof (window as any).openGenesysChat === 'function') {
            (window as any).openGenesysChat();
          } else if (
            (window as any).CXBus &&
            typeof (window as any).CXBus.command === 'function'
          ) {
            (window as any).CXBus.command('WebChat.open');
          } else {
            alert('No chat functions found');
          }
        };

        document.body.appendChild(btn);
        return 'Emergency button created';
      }
    }, 1000);

    return 'CSS fix initiated';
  };

  console.log(
    '[GLOBAL] Added fixChatButtonCSS() function to window. Run window.fixChatButtonCSS() to fix styling issues.',
  );
}
