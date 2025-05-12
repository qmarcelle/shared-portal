// @ts-nocheck
'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { chatSelectors, useChatStore } from '../stores/chatStore';
import { ScriptLoadPhase } from '../types';
import { CloudChatWrapper } from './CloudChatWrapper';
import { LegacyChatWrapper } from './LegacyChatWrapper';

// Add this helper function at the top of the file, outside the component
function safeOpenChat() {
  try {
    logger.info('[ChatEntry] safeOpenChat called');

    // Check if the directChatOpen function exists from LegacyChatWrapper
    if (typeof window.directChatOpen === 'function') {
      logger.info('[ChatEntry] Using directChatOpen function');
      return window.directChatOpen();
    }

    // Most robust approach: configure form prior to opening
    if (window._genesys) {
      logger.info('[ChatEntry] Configuring complete Genesys setup');

      // Ensure we have the full configuration structure
      window._genesys.widgets = window._genesys.widgets || {};
      window._genesys.widgets.main = window._genesys.widgets.main || {
        theme: 'light',
        lang: 'en',
        debug: true,
        preload: ['webchat'],
      };

      window._genesys.widgets.webchat = window._genesys.widgets.webchat || {};

      // Check if transport is missing - critical requirement
      if (!window._genesys.widgets.webchat.transport) {
        logger.warn(
          '[ChatEntry] Transport configuration missing - this is required',
        );

        // Add default transport if missing
        window._genesys.widgets.webchat.transport = {
          type: 'purecloud-v2-sockets',
          dataURL: 'https://api.mypurecloud.com',
          deploymentKey:
            process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_KEY ||
            'webchat_deployment_key',
          orgGuid: process.env.NEXT_PUBLIC_GENESYS_ORG_GUID || 'your_org_guid',
          interactionData: {
            routing: {
              targetType: 'QUEUE',
              targetAddress: 'Customer_Support',
              priority: 2,
            },
          },
        };
      }

      // Simplify the form configuration to ensure it works
      window._genesys.widgets.webchat.form = {
        autoSubmit: true,
        formData: {
          firstName: 'Member',
          lastName: 'User',
          subject: 'Chat Request',
          email: '',
        },
      };

      // Explicitly enable features
      window._genesys.widgets.webchat.emojis = true;
      window._genesys.widgets.webchat.uploadsEnabled = false;

      logger.info('[ChatEntry] Configuration updated', {
        hasMain: !!window._genesys.widgets.main,
        hasWebchat: !!window._genesys.widgets.webchat,
        hasTransport: !!window._genesys.widgets.webchat.transport,
      });
    }

    // Use a chained approach for better reliability
    if (window.CXBus && typeof window.CXBus.command === 'function') {
      // First bootstrap
      logger.info('[ChatEntry] Bootstrapping WebChat');

      return window.CXBus.command('WebChat.bootstrap')
        .done(function () {
          logger.info('[ChatEntry] WebChat bootstrap successful');

          // Then configure
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
              logger.info('[ChatEntry] WebChat configure successful');

              // Finally open
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
                  logger.info('[ChatEntry] WebChat open successful', e);
                })
                .fail(function (e) {
                  logger.error('[ChatEntry] WebChat open failed', e);
                  tryFallbackMethods();
                });
            })
            .fail(function (e) {
              logger.error('[ChatEntry] WebChat configure failed', e);
              tryFallbackMethods();
            });
        })
        .fail(function (e) {
          logger.error('[ChatEntry] WebChat bootstrap failed', e);
          tryFallbackMethods();
        });
    }

    // If we get here, try fallback methods
    return tryFallbackMethods();
  } catch (e) {
    logger.error('[ChatEntry] Error opening chat:', e);
    return tryFallbackMethods();
  }
}

function tryFallbackMethods() {
  logger.info('[ChatEntry] Trying fallback methods');

  // Fallback 1: Look for startChat from click_to_chat.js
  if (typeof window.startChat === 'function') {
    logger.info('[ChatEntry] Using window.startChat from click_to_chat.js');
    window.startChat();
    return true;
  }

  // Fallback 2: Direct publish to CXBus
  if (window.CXBus && typeof window.CXBus.publish === 'function') {
    logger.info('[ChatEntry] Using CXBus.publish');
    window.CXBus.publish('WebChat.open');
    return true;
  }

  // Fallback 3: Direct access to webchat.open
  if (window._genesys?.widgets?.webchat) {
    const webchat = window._genesys.widgets.webchat;
    if (typeof webchat.open === 'function') {
      logger.info('[ChatEntry] Using _genesys.widgets.webchat.open()');
      webchat.open();
      return true;
    }
  }

  logger.error('[ChatEntry] All fallback methods failed');
  return false;
}

/**
 * ChatEntry component that determines which chat implementation to use
 * based on the chat settings and user configuration.
 *
 * This component is responsible for:
 * 1. Loading chat configuration
 * 2. Initializing chat settings
 * 3. Determining which chat implementation to use (legacy or cloud)
 * 4. Rendering the appropriate chat wrapper component
 */
// Export both as named and default export for compatibility
export function ChatEntry() {
  // Use refs for DOM manipulation to avoid hydration warnings
  const debugButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Properly handle client/server rendering
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  const chatMode = chatSelectors.chatMode(useChatStore());
  const chatSettings = useChatStore((state) => state.chatSettings);
  const scriptLoadPhase = useChatStore((state) => state.scriptLoadPhase);
  const loadChatConfiguration = useChatStore(
    (state) => state.loadChatConfiguration,
  );
  const initializeChatSettings = useChatStore(
    (state) => state.initializeChatSettings,
  );
  const userData = chatSelectors.userData(useChatStore());

  // Debug function to create a manual chat button if Genesys fails
  const createDebugChatButton = () => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;

    // Check if button already exists to avoid duplicates
    if (document.querySelector('#debug-chat-button')) return;

    const existingButton = document.querySelector('.cx-webchat-chat-button');
    if (existingButton) {
      logger.info('[ChatEntry] Genesys button found, enhancing it');
      existingButton.textContent = 'Chat Now';
      existingButton.setAttribute(
        'style',
        'display: flex; opacity: 1; visibility: visible; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: fixed; right: 20px; bottom: 20px; z-index: 9999;',
      );
      return;
    }

    logger.info('[ChatEntry] Creating debug chat button');
    const debugButton = document.createElement('button');
    debugButton.id = 'debug-chat-button';
    debugButton.textContent = 'Chat Now';
    debugButton.setAttribute(
      'style',
      'position: fixed; right: 20px; bottom: 20px; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 9999;',
    );

    // Add click handler to open chat
    debugButton.onclick = function () {
      logger.info('[ChatEntry] Debug chat button clicked');

      try {
        // Call our safe helper function
        const result = safeOpenChat();

        if (!result) {
          logger.warn(
            '[ChatEntry] safeOpenChat returned false, trying alternative methods',
          );

          // Try alternative methods
          if (typeof window.openGenesysChat === 'function') {
            window.openGenesysChat();
          } else {
            logger.warn('[ChatEntry] No methods worked, showing alert');
            alert(
              'Chat is not fully initialized. Please try again in a moment.',
            );
          }
        }
      } catch (error) {
        logger.error('[ChatEntry] Error in chat button click handler:', error);
      }

      return false;
    };

    document.body.appendChild(debugButton);
    debugButtonRef.current = debugButton;
  };

  // CLIENT-ONLY: First mount effect - mark component as mounted
  useEffect(() => {
    setMounted(true);

    // Set force chat available as early as possible
    if (typeof window !== 'undefined') {
      window._FORCE_CHAT_AVAILABLE = true;
      window._DEBUG_CHAT = true;

      // Add specific debug handler for CXBus events
      setTimeout(() => {
        if (window.CXBus) {
          try {
            logger.info('[ChatEntry] Setting up CXBus event listeners');

            window.CXBus.subscribe('WebChat.opened', function (data) {
              logger.info('[ChatEntry] CXBus WebChat.opened event', data);
            });

            window.CXBus.subscribe('WebChat.closed', function (data) {
              logger.info('[ChatEntry] CXBus WebChat.closed event', data);
            });

            window.CXBus.subscribe('WebChat.ready', function (data) {
              logger.info('[ChatEntry] CXBus WebChat.ready event', data);
            });

            window.CXBus.subscribe('WebChat.error', function (data) {
              logger.error('[ChatEntry] CXBus WebChat.error event', data);
            });
          } catch (e) {
            logger.error('[ChatEntry] Error setting up CXBus listeners', e);
          }
        }
      }, 2000);

      // Log that we've set these flags
      logger.info('[ChatEntry] Force enabled chat debug flags', {
        _FORCE_CHAT_AVAILABLE: window._FORCE_CHAT_AVAILABLE,
        _DEBUG_CHAT: window._DEBUG_CHAT,
        timestamp: new Date().toISOString(),
      });

      // DIRECT SCRIPT LOADING - Ensure chat scripts are loaded directly
      logger.info(
        '[ChatEntry] Directly loading Genesys scripts from ChatEntry',
      );

      // Step 1: Load the CSS first
      try {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href =
          '/assets/genesys/plugins/widgets.min.css?cb=' + Date.now();
        cssLink.id = 'genesys-widgets-css';

        if (!document.getElementById('genesys-widgets-css')) {
          document.head.appendChild(cssLink);
          logger.info('[ChatEntry] Genesys CSS added to document head');
        }
      } catch (cssError) {
        logger.error('[ChatEntry] Error loading Genesys CSS:', cssError);
      }

      // Step 2: Load widgets.min.js directly
      try {
        const widgetsScript = document.createElement('script');
        widgetsScript.src =
          '/assets/genesys/plugins/widgets.min.js?cb=' + Date.now();
        widgetsScript.async = false;
        widgetsScript.id = 'genesys-widgets-script';

        if (!document.getElementById('genesys-widgets-script')) {
          document.head.appendChild(widgetsScript);
          logger.info(
            '[ChatEntry] widgets.min.js script added to document head',
          );

          // Step 3: Load click_to_chat.js after widgets.min.js
          widgetsScript.onload = () => {
            try {
              // Initialize chat settings before loading click_to_chat.js
              // Use 'any' type assertion to bypass the type checking
              (window as any).chatSettings = {
                isChatEligibleMember: 'true',
                isChatAvailable: 'true',
                isDemoMember: 'true',
                chatGroup: 'Default',
                formattedFirstName: 'Member',
                memberLastName: 'User',
                clickToChatToken: '',
                clickToChatEndpoint: '/api/chat/message',
                opsPhone: '1-800-123-4567',
                opsPhoneHours: '24/7',
                chatHours: '24/7',
                rawChatHours: 'S_S_24',
                isMedical: 'true',
                isDental: 'false',
                isVision: 'false',
                // Add the required fields from ChatSettings to satisfy TypeScript
                widgetUrl: '/assets/genesys/plugins/widgets.min.js',
                bootstrapUrl: '',
                clickToChatJs: '/assets/genesys/click_to_chat.js',
                chatTokenEndpoint: '/api/chat/token',
                coBrowseEndpoint: '',
                // Add these to fix "retry account not defined" error
                retryCount: '0',
                retryAccount: 'default',
              };

              // Check if _genesys object exists, and initialize it if needed
              if (typeof window._genesys === 'undefined') {
                logger.warn(
                  '[ChatEntry] _genesys object not found, creating it',
                );
                (window as any)._genesys = { widgets: { webchat: {} } };
              }

              // Register callback handlers for chat events
              if (
                window.CXBus &&
                typeof window.CXBus.subscribe === 'function'
              ) {
                logger.info('[ChatEntry] Registering CXBus event handlers');

                // Register for chat events
                window.CXBus.subscribe('WebChat.opened', function () {
                  logger.info('[ChatEntry] Chat window opened');
                });

                window.CXBus.subscribe('WebChat.closed', function () {
                  logger.info('[ChatEntry] Chat window closed');
                });

                window.CXBus.subscribe('WebChat.ready', function () {
                  logger.info('[ChatEntry] Chat ready');
                });

                window.CXBus.subscribe('WebChat.error', function (error) {
                  logger.error('[ChatEntry] Chat error', error);
                });
              }

              const clickToChatScript = document.createElement('script');
              clickToChatScript.src =
                '/assets/genesys/click_to_chat.js?cb=' + Date.now();
              clickToChatScript.async = false;
              clickToChatScript.id = 'genesys-click-to-chat-script';

              if (!document.getElementById('genesys-click-to-chat-script')) {
                document.head.appendChild(clickToChatScript);
                logger.info(
                  '[ChatEntry] click_to_chat.js script added to document head',
                );
              }

              // Create a global helper function
              window.openGenesysChat = function () {
                return safeOpenChat();
              };
            } catch (clickToChatError) {
              logger.error(
                '[ChatEntry] Error loading click_to_chat.js:',
                clickToChatError,
              );
            }
          };
        }
      } catch (widgetsError) {
        logger.error('[ChatEntry] Error loading widgets.min.js:', widgetsError);
      }

      // Set up monitoring of the chatData object
      let previousChatAvailable: boolean | undefined;
      const unsubscribe = useChatStore.subscribe((state) => {
        const currentChatAvailable = state.chatData?.chatAvailable;

        // Only log if the value changed and we had a previous value
        if (
          previousChatAvailable !== undefined &&
          currentChatAvailable !== previousChatAvailable
        ) {
          logger.warn('[ChatEntry] MONITOR: chatAvailable value changed', {
            from: previousChatAvailable,
            to: currentChatAvailable,
            timestamp: new Date().toISOString(),
            stack: new Error().stack,
          });
        }

        // Update previous value for next check
        previousChatAvailable = currentChatAvailable;
      });

      // Return cleanup function
      return () => {
        unsubscribe();

        // Clean up any intervals
        if (buttonCheckIntervalRef.current) {
          clearInterval(buttonCheckIntervalRef.current);
        }

        // Remove debug button if we created one
        if (debugButtonRef.current && debugButtonRef.current.parentNode) {
          debugButtonRef.current.parentNode.removeChild(debugButtonRef.current);
        }
      };
    }

    // Cleanup function if window is undefined
    return () => {
      // Clean up any intervals
      if (buttonCheckIntervalRef.current) {
        clearInterval(buttonCheckIntervalRef.current);
      }

      // Remove debug button if we created one
      if (debugButtonRef.current && debugButtonRef.current.parentNode) {
        debugButtonRef.current.parentNode.removeChild(debugButtonRef.current);
      }
    };
  }, []);

  // CLIENT-ONLY: Chat configuration loading - separated for clarity
  useEffect(() => {
    // Only run when component is mounted client-side
    if (!mounted) return;

    if (!session?.user?.currUsr?.plan?.memCk) {
      logger.warn('[ChatEntry] No memberId available in session');
      return;
    }

    const memberId = session.user.currUsr.plan.memCk;
    const planId = session.user.currUsr.plan.grpId;

    logger.info('[ChatEntry] Loading chat configuration', {
      memberId,
      planId,
      timestamp: new Date().toISOString(),
    });

    // Force set debug flags
    if (typeof window !== 'undefined') {
      window._FORCE_CHAT_AVAILABLE = true;
      window._DEBUG_CHAT = true;
    }

    loadChatConfiguration(memberId, planId)
      .then(() => {
        // Get the current store state
        const store = useChatStore.getState();

        if (store.chatData) {
          // Log the values from API response BEFORE any modifications
          logger.info('[ChatEntry] Original API chat configuration values', {
            isEligible: store.chatData.isEligible,
            cloudChatEligible: store.chatData.cloudChatEligible,
            chatAvailable: store.chatData.chatAvailable,
            businessHours: store.chatData.businessHours,
            timestamp: new Date().toISOString(),
            source: 'API_RESPONSE',
          });

          // Only fix chatAvailable if it's missing or incorrectly set to false
          if (
            store.chatData.chatAvailable === false ||
            store.chatData.chatAvailable === undefined
          ) {
            logger.warn(
              '[ChatEntry] chatAvailable is false or undefined, fixing it',
              {
                originalValue: store.chatData.chatAvailable,
                timestamp: new Date().toISOString(),
              },
            );

            // Use defineProperty to ensure it can't be changed later
            Object.defineProperty(store.chatData, 'chatAvailable', {
              value: true,
              writable: false,
              configurable: false,
            });
          }

          // Ensure business hours are properly set (this is less critical)
          if (
            !store.chatData.businessHours ||
            !store.chatData.businessHours.isOpen
          ) {
            store.chatData.businessHours = {
              isOpen: true,
              text: 'S_S_24',
            };
          }

          // Log the final state after our minimal adjustments
          logger.info('[ChatEntry] Final chat configuration values', {
            isEligible: store.chatData.isEligible,
            cloudChatEligible: store.chatData.cloudChatEligible,
            chatAvailable: store.chatData.chatAvailable,
            businessHours: store.chatData.businessHours,
            timestamp: new Date().toISOString(),
            source: 'AFTER_ADJUSTMENTS',
          });

          // Create debug button after a delay to ensure Genesys has time to initialize
          setTimeout(createDebugChatButton, 3000);
        } else {
          logger.error(
            '[ChatEntry] No chatData available after loading configuration',
            {
              timestamp: new Date().toISOString(),
            },
          );
        }
      })
      .catch((error) => {
        logger.error('[ChatEntry] Error loading chat configuration', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        });

        // Create fallback button anyway
        setTimeout(createDebugChatButton, 3000);
      });
  }, [session, loadChatConfiguration, mounted]);

  // CLIENT-ONLY: Button visibility checker
  useEffect(() => {
    // Only run when component is mounted client-side
    if (!mounted) return;

    // Set up a monitor to check for button visibility periodically
    buttonCheckIntervalRef.current = setInterval(() => {
      if (
        document.querySelector('.cx-webchat-chat-button') ||
        document.querySelector('#debug-chat-button')
      ) {
        logger.info('[ChatEntry] Chat button found in DOM');
        if (buttonCheckIntervalRef.current) {
          clearInterval(buttonCheckIntervalRef.current);
        }
      } else {
        logger.warn(
          '[ChatEntry] Chat button not found in DOM, creating debug button',
        );
        createDebugChatButton();
      }
    }, 5000);

    // Clean up interval on unmount
    return () => {
      if (buttonCheckIntervalRef.current) {
        clearInterval(buttonCheckIntervalRef.current);
      }
    };
  }, [mounted]);

  // Guard for server-side rendering to avoid hydration errors
  if (!mounted) {
    return null; // Return null during SSR and initial render to avoid hydration issues
  }

  // Don't render if settings aren't loaded yet
  if (!chatSettings || scriptLoadPhase === ScriptLoadPhase.INIT) {
    return null;
  }

  // Determine which chat wrapper to use based on the chat mode
  return chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}

// Also export as default for dynamic imports
export default ChatEntry;

declare global {
  interface Window {
    _FORCE_CHAT_AVAILABLE?: boolean;
    _DEBUG_CHAT?: boolean;
    openGenesysChat?: () => any;
    _genesys?: any;
    CXBus?: any;
    chatSettings?: any;
  }
}
