// @ts-nocheck
'use client';
// Remove direct import of CSS - we'll load it dynamically
// import '@/../public/assets/genesys/plugins/widgets.min.css';
import { CHAT_ENDPOINTS, getChatConfig } from '@/app/chat/config/endpoints';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logChatConfigDiagnostics } from '@/app/chat/utils/chatDebugger';
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

    // Load our custom chat fix CSS
    const customCssLink = document.createElement('link');
    customCssLink.rel = 'stylesheet';
    customCssLink.href = '/assets/genesys/chat-fix.css?cb=' + Date.now();
    customCssLink.id = 'genesys-chat-fix-css';
    if (!document.getElementById('genesys-chat-fix-css')) {
      document.head.appendChild(customCssLink);
      console.log('[ChatScriptLoader] Added custom chat fix CSS');
    }

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

  // Updated script loading with correct sequence
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log(
      '[ChatScriptLoader] Beginning script load sequence in correct order',
    );

    const loadScriptsInOrder = async () => {
      try {
        // Step 1: First load widget config
        console.log('[ChatScriptLoader] Step 1: Loading widget-config.js');
        const configScript = document.createElement('script');
        configScript.src = '/assets/genesys/widget-config.js?cb=' + Date.now();
        configScript.async = false;
        configScript.id = 'genesys-widget-config-script';

        // Only append if it doesn't already exist
        if (!document.getElementById('genesys-widget-config-script')) {
          document.head.appendChild(configScript);
          await new Promise<void>((resolve, reject) => {
            configScript.onload = () => {
              console.log(
                '[ChatScriptLoader] widget-config.js loaded successfully',
              );
              resolve();
            };
            configScript.onerror = (e) => {
              console.error(
                '[ChatScriptLoader] Failed to load widget-config.js:',
                e,
              );
              reject(new Error('Failed to load widget-config.js'));
            };
          });
        } else {
          console.log('[ChatScriptLoader] widget-config.js already exists');
        }

        // Step 2: Then load widgets.min.js
        console.log('[ChatScriptLoader] Step 2: Loading widgets.min.js');
        const widgetsScript = document.createElement('script');
        widgetsScript.src =
          '/assets/genesys/plugins/widgets.min.js?cb=' + Date.now();
        widgetsScript.async = false;
        widgetsScript.id = 'genesys-widgets-script';

        // Only append if it doesn't already exist
        if (!document.getElementById('genesys-widgets-script')) {
          document.head.appendChild(widgetsScript);
          await new Promise<void>((resolve, reject) => {
            widgetsScript.onload = () => {
              console.log(
                '[ChatScriptLoader] widgets.min.js loaded successfully',
              );
              setWidgetsLoaded(true);
              resolve();
            };
            widgetsScript.onerror = (e) => {
              console.error(
                '[ChatScriptLoader] Failed to load widgets.min.js:',
                e,
              );
              setLoadingErrors((prev) => [
                ...prev,
                'Failed to load widgets.min.js',
              ]);
              reject(new Error('Failed to load widgets.min.js'));
            };
          });
        } else {
          console.log('[ChatScriptLoader] widgets.min.js already exists');
          setWidgetsLoaded(true);
        }

        // Step 3: Finally load click_to_chat.js
        console.log('[ChatScriptLoader] Step 3: Loading click_to_chat.js');
        const clickToChatScript = document.createElement('script');
        clickToChatScript.src =
          '/assets/genesys/click_to_chat.js?cb=' + Date.now();
        clickToChatScript.async = false;
        clickToChatScript.id = 'genesys-click-to-chat-script';

        // Initialize chat settings object BEFORE loading click_to_chat.js
        if (!window.chatSettings) {
          window.chatSettings = {
            isChatEligibleMember: 'true',
            isChatAvailable: 'true',
            isDemoMember: 'true',
            chatGroup: 'Default',
            formattedFirstName: 'Member',
            memberLastName: 'User',
            clickToChatToken: chatSettings?.token || '',
            clickToChatEndpoint:
              chatConfig.CLICK_TO_CHAT_ENDPOINT || '/api/chat/message',
            opsPhone: '1-800-123-4567',
            opsPhoneHours: '24/7',
            chatHours: '24/7',
            rawChatHours: 'S_S_24',
            isMedical: 'true',
            isDental: 'false',
            isVision: 'false',
            retryCount: '0',
            retryAccount: 'default',
          };
          console.log('[ChatScriptLoader] Initialized window.chatSettings');
        }

        // Only append if it doesn't already exist
        if (!document.getElementById('genesys-click-to-chat-script')) {
          document.head.appendChild(clickToChatScript);
          await new Promise<void>((resolve, reject) => {
            clickToChatScript.onload = () => {
              console.log(
                '[ChatScriptLoader] click_to_chat.js loaded successfully',
              );
              setClickToChatLoaded(true);
              resolve();
            };
            clickToChatScript.onerror = (e) => {
              console.error(
                '[ChatScriptLoader] Failed to load click_to_chat.js:',
                e,
              );
              setLoadingErrors((prev) => [
                ...prev,
                'Failed to load click_to_chat.js',
              ]);
              reject(new Error('Failed to load click_to_chat.js'));
            };
          });
        } else {
          console.log('[ChatScriptLoader] click_to_chat.js already exists');
          setClickToChatLoaded(true);
        }

        console.log('[ChatScriptLoader] All scripts loaded successfully');

        // Register debug function
        window.debugGenesysChat = function () {
          console.log('=== GENESYS CHAT DEBUG ===');
          console.log('CXBus available:', typeof window.CXBus !== 'undefined');
          console.log('_genesys object:', window._genesys);
          console.log('GenesysWebChat:', typeof window.GenesysWebChat);

          if (window.CXBus && typeof window.CXBus.subscribe === 'function') {
            // Register for all events to see what's happening
            window.CXBus.subscribe('*', function (event) {
              console.log('CXBus Event:', event);
            });
          }

          // Try to manually force the widget to initialize
          if (window.CXBus && typeof window.CXBus.command === 'function') {
            window.CXBus.command('WebChat.renderPopup', {});
          }
        };

        // Call debug function after a delay to let things initialize
        setTimeout(() => {
          if (typeof window.debugGenesysChat === 'function') {
            window.debugGenesysChat();
          }
        }, 5000);
      } catch (error) {
        console.error(
          '[ChatScriptLoader] Error in script loading sequence:',
          error,
        );
        setLoadingErrors((prev) => [
          ...prev,
          `Script loading sequence error: ${error.message}`,
        ]);
      }
    };

    loadScriptsInOrder();

    // Clean up on unmount
    return () => {
      const scripts = [
        'genesys-widget-config-script',
        'genesys-widgets-script',
        'genesys-click-to-chat-script',
      ];

      scripts.forEach((id) => {
        const script = document.getElementById(id);
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []); // Empty dependency array to run only once on mount

  // Remove the other useEffect hooks that load scripts individually
  // (the ones for "step 1" and "step 2" that we're replacing with this new approach)

  // Keep Step 3: Create the chat button if needed
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

            // After enabling, add a direct click handler to the Genesys button
            setTimeout(() => {
              const genesysButton = document.querySelector(
                '.cx-webchat-chat-button',
              );
              if (genesysButton) {
                console.log(
                  '[ChatScriptLoader] Adding direct click handler to Genesys button',
                );
                (genesysButton as HTMLElement).onclick = function () {
                  console.log(
                    '[ChatScriptLoader] Genesys button clicked directly',
                  );
                  if (
                    window.CXBus &&
                    typeof window.CXBus.command === 'function'
                  ) {
                    // Use the more direct form configuration
                    window.CXBus.command('WebChat.open', {
                      form: {
                        autoSubmit: true,
                        formData: {
                          firstName: 'Member',
                          lastName: 'User',
                          subject: 'Chat Request',
                        },
                      },
                    });
                  }
                };

                // Hide any debug buttons if we have a real Genesys button
                const debugButton =
                  document.getElementById('debug-chat-button');
                if (debugButton) {
                  console.log(
                    '[ChatScriptLoader] Hiding debug button since Genesys button exists',
                  );
                  debugButton.style.display = 'none';
                }
              }
            }, 1000);
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

    // Make directChatOpen available globally
    if (typeof directChatOpen === 'function') {
      (window as any).directChatOpen = directChatOpen;
      console.log(
        '[LegacyChatWrapper] Published directChatOpen function globally',
      );
    }

    // Add a helper function to make directChatOpen global in case it's not available yet
    (window as any)._makeDirectChatOpenGlobal = function () {
      if (typeof directChatOpen === 'function') {
        (window as any).directChatOpen = directChatOpen;
        console.log(
          '[LegacyChatWrapper] Made directChatOpen function globally available',
        );
        return true;
      }
      return false;
    };
  }, []);

  return (
    <>
      {/* Add ID for component identification */}
      <div id="legacy-chat-wrapper" style={{ display: 'none' }}></div>
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

// Near the bottom of the file, add a global helper function
// Add this before the if (typeof window !== 'undefined') check
function getChatDataURL() {
  // Use Genesys Cloud production API URL
  return 'https://api.mypurecloud.com';
}

function getDeploymentKey() {
  // This should be your actual deployment key from Genesys Cloud
  return (
    process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_KEY || 'webchat_deployment_key'
  );
}

function getOrgGuid() {
  // This should be your actual org GUID from Genesys Cloud
  return process.env.NEXT_PUBLIC_GENESYS_ORG_GUID || 'your_org_guid';
}

// This will be called when the chat button is clicked
function directChatOpen() {
  console.log('[GLOBAL] directChatOpen called');

  // Basic error handling
  if (!window.CXBus) {
    console.error('[GLOBAL] CXBus not available');
    alert('Chat service is currently unavailable. Please try again later.');
    return;
  }

  try {
    // Complete configuration - this is critical for the chat to open properly
    if (window._genesys) {
      // First ensure we have the main configuration
      window._genesys.widgets = window._genesys.widgets || {};
      window._genesys.widgets.main = window._genesys.widgets.main || {
        theme: 'light',
        lang: 'en',
        i18n: {},
        debug: true, // Set to true for debugging
        preload: ['webchat'], // Preload webchat plugin
      };

      // Configure webchat with proper transport and form
      window._genesys.widgets.webchat = {
        transport: {
          type: 'purecloud-v2-sockets',
          dataURL: getChatDataURL(),
          deploymentKey: getDeploymentKey(),
          orgGuid: getOrgGuid(),
          interactionData: {
            routing: {
              targetType: 'QUEUE',
              targetAddress: 'Customer_Support', // Replace with your queue name
              priority: 2,
            },
          },
        },
        form: {
          autoSubmit: true, // Automatically submit the form
          firstName: 'Member', // Default value
          lastName: 'User', // Default value
          email: '',
          subject: 'Chat Request',
        },
        // Explicitly enable chat features
        uploadsEnabled: false,
        allowedFileExtensions: '',
        emojis: true,
        cometD: {
          enabled: false,
        },
      };

      console.log('[GLOBAL] Updated Genesys configuration', {
        hasMain: !!window._genesys.widgets.main,
        hasWebchat: !!window._genesys.widgets.webchat,
        hasTransport: !!window._genesys.widgets.webchat?.transport,
        deploymentKey:
          window._genesys.widgets.webchat?.transport?.deploymentKey?.substring(
            0,
            5,
          ) + '...',
        orgGuid:
          window._genesys.widgets.webchat?.transport?.orgGuid?.substring(0, 5) +
          '...',
      });
    } else {
      console.error('[GLOBAL] _genesys not initialized');
    }

    // First bootstrap the widget to ensure all components are loaded
    console.log('[GLOBAL] Bootstrapping WebChat');
    window.CXBus.command('WebChat.bootstrap')
      .done(function () {
        console.log('[GLOBAL] WebChat.bootstrap succeeded');

        // Now configure the WebChat session
        console.log('[GLOBAL] Configuring WebChat session');
        window.CXBus.command('WebChat.configure', {
          form: {
            autoSubmit: true,
            formData: {
              firstName: 'Member',
              lastName: 'User',
            },
          },
        })
          .done(function () {
            console.log('[GLOBAL] WebChat.configure succeeded');

            // Finally, open the chat with a complete configuration
            console.log('[GLOBAL] Opening WebChat window');
            window.CXBus.command('WebChat.open', {
              form: {
                autoSubmit: true,
                formData: {
                  firstName: 'Member',
                  lastName: 'User',
                  subject: 'Chat Request',
                },
              },
            })
              .done(function (e) {
                console.log('[GLOBAL] WebChat.open succeeded', e);
              })
              .fail(function (e) {
                console.error('[GLOBAL] WebChat.open failed', e);
                fallbackChatOpen();
              });
          })
          .fail(function (e) {
            console.error('[GLOBAL] WebChat.configure failed', e);
            fallbackChatOpen();
          });
      })
      .fail(function (e) {
        console.error('[GLOBAL] WebChat.bootstrap failed', e);
        fallbackChatOpen();
      });
  } catch (e) {
    console.error('[GLOBAL] Error in directChatOpen', e);
    fallbackChatOpen();
  }
}

// Fallback method to open chat if the normal flow fails
function fallbackChatOpen() {
  console.log('[GLOBAL] Using fallback chat open method');

  try {
    // Try more direct methods
    if (window._genesys?.widgets?.webchat?.open) {
      console.log('[GLOBAL] Using _genesys.widgets.webchat.open()');
      window._genesys.widgets.webchat.open();
      return;
    }

    // Try publishing directly to the CXBus
    if (window.CXBus?.publish) {
      console.log('[GLOBAL] Using CXBus.publish()');
      window.CXBus.publish('WebChat.open');
      return;
    }

    // Last resort - try a simple command without options
    if (window.CXBus?.command) {
      console.log('[GLOBAL] Using simple CXBus.command()');
      window.CXBus.command('WebChat.open');
      return;
    }

    console.error('[GLOBAL] All fallback methods failed');
    alert('Unable to open chat. Please try again later or contact support.');
  } catch (e) {
    console.error('[GLOBAL] Error in fallbackChatOpen', e);
    alert('Chat service encountered an error. Please try again later.');
  }
}

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
  (window as any).openGenesysChat = directChatOpen;

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

      // Add proper configuration for the webchat widget
      window._genesys.widgets.main = {
        debug: true, // Enable debug mode
        theme: 'light',
        preload: ['webchat'],
      };

      // Configure webchat properly - this is critical
      window._genesys.widgets.webchat = {
        transport: {
          type: 'purecloud-v2-sockets',
          dataURL: 'https://api.mypurecloud.com',
          deploymentKey: 'webchat_deployment_key', // This should match your actual Genesys deployment key
          orgGuid: 'your_org_guid', // This should match your actual Genesys org GUID
          interactionData: {
            routing: {
              targetType: 'QUEUE',
              targetAddress: 'Customer_Support', // This should match your queue name
              priority: 2,
            },
          },
        },
        chatButton: {
          enabled: true,
          template:
            '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
          openDelay: 100,
          effectDuration: 200,
          hideDuringInvite: false,
        },
        emojis: true,
        uploadsEnabled: false,
        cometD: {
          enabled: false,
        },
        // Add a callback when chat fails to initialize
        failed: function () {
          console.error('[GLOBAL] Chat widget failed to initialize');
          // Create a fallback button
          createEmergencyChatButton();
        },
      };

      // Add advanced debugging for CXBus events
      setTimeout(() => {
        if (window.CXBus) {
          console.log('[GLOBAL] Setting up CXBus event listeners');

          try {
            window.CXBus.subscribe('WebChat.opened', function (data) {
              console.log('[GLOBAL] CXBus WebChat.opened event received', data);
            });

            window.CXBus.subscribe('WebChat.closed', function (data) {
              console.log('[GLOBAL] CXBus WebChat.closed event received', data);
            });

            window.CXBus.subscribe('WebChat.ready', function (data) {
              console.log('[GLOBAL] CXBus WebChat.ready event received', data);
            });

            window.CXBus.subscribe('WebChat.error', function (data) {
              console.error(
                '[GLOBAL] CXBus WebChat.error event received',
                data,
              );
            });

            window.CXBus.subscribe('WebChat.unloaded', function (data) {
              console.log(
                '[GLOBAL] CXBus WebChat.unloaded event received',
                data,
              );
            });

            // Force initialization - tries to bootstrap the widget if it hasn't already been done
            window.CXBus.command('WebChat.bootstrap');
          } catch (e) {
            console.error('[GLOBAL] Error setting up CXBus event listeners', e);
          }
        }
      }, 3000);

      window._genesys.widgets.onReady = function () {
        console.log('[GLOBAL] Genesys widgets are ready');

        // Force enable chat and check for errors
        if (window._genesys.widgets.webchat) {
          console.log('[GLOBAL] Chat button configured');

          // Try to register error handlers for webchat
          if (window._genesys.widgets.extensions) {
            console.log('[GLOBAL] Registering custom error handlers');
            window._genesys.widgets.extensions.errorHandler = function (error) {
              console.error('[GLOBAL] Genesys widget error:', error);
            };
          }
        } else {
          console.error('[GLOBAL] webchat configuration missing after onReady');
        }
      };
    }
  }, 2000);

  // When creating the debug button, use our direct function
  setTimeout(() => {
    const debugButton = document.getElementById('debug-chat-button');
    if (debugButton) {
      console.log('[GLOBAL] Adding click handler to debug button');
      debugButton.onclick = function () {
        console.log('[GLOBAL] Debug button clicked');
        directChatOpen();
      };
    }
  }, 1000);

  // Add a watcher that periodically checks if the Genesys chat button is working
  // and if not, tries to fix it
  setInterval(function () {
    try {
      const genesysButton = document.querySelector('.cx-webchat-chat-button');
      const debugButton = document.getElementById('debug-chat-button');

      if (genesysButton) {
        // Ensure the button has a click handler
        if (!(genesysButton as HTMLElement).onclick) {
          console.log(
            '[GLOBAL] Adding missing click handler to Genesys button',
          );
          (genesysButton as HTMLElement).onclick = function () {
            console.log('[GLOBAL] Fixed click handler activated');
            if (window.CXBus && typeof window.CXBus.command === 'function') {
              window.CXBus.command('WebChat.open', {
                form: {
                  autoSubmit: true,
                },
              });
            }
          };
        }

        // Hide debug button if Genesys button exists
        if (
          debugButton &&
          window.getComputedStyle(debugButton).display !== 'none'
        ) {
          debugButton.style.display = 'none';
        }
      } else if (
        debugButton &&
        window.getComputedStyle(debugButton).display === 'none'
      ) {
        // Show debug button if Genesys button doesn't exist
        debugButton.style.display = 'block';
      }
    } catch (e) {
      console.error('[GLOBAL] Error in chat button watcher:', e);
    }
  }, 5000); // Check every 5 seconds
}
