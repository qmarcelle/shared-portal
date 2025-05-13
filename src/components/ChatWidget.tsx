'use client';

import { useChatSetup } from '@/app/chat/hooks/useChatSetup';
import { useChatStore } from '@/app/chat/stores/chatStore';
import {
  logChatConfigDiagnostics,
  validateChatConfig,
} from '@/app/chat/utils/chatDebugger';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// Accept any shape for chatSettings, as it is aggregated server-side
export interface ChatWidgetProps {
  chatSettings: any;
}

export default function ChatWidget({ chatSettings }: ChatWidgetProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, isChatActive, isLoading, error, chatData } = useChatStore();
  const { loadChatConfiguration } = useChatStore();

  // Define routes where chat should never appear
  const excludedPaths = [
    '/login',
    '/error',
    '/auth/error',
    '/sso/redirect',
    '/embed/security',
  ];

  // Immediately log session data when component first renders
  useEffect(() => {
    console.log('[ChatWidget] Initial render session data:', {
      session: session ? 'exists' : 'null',
      user: session?.user ? 'exists' : 'null',
      plan: session?.user?.currUsr?.plan ? 'exists' : 'null',
      pathname,
      isExcludedPath: excludedPaths.some((path) => pathname.startsWith(path)),
    });
  }, [pathname, session, excludedPaths]);

  // Use a fallback for chatMode if cloudChatEligible is undefined
  const chatMode = chatData?.cloudChatEligible === true ? 'cloud' : 'legacy';

  useChatSetup(chatMode);

  // Chat session for passing to wrappers
  const chatSession = {
    isOpen,
    isChatActive,
    isLoading,
    error,
    startChat: useChatStore((state) => state.startChat),
    endChat: useChatStore((state) => state.endChat),
  };

  // Trigger loadChatConfiguration if needed and we have a session with plan
  useEffect(() => {
    if (!chatData && session?.user?.currUsr?.plan) {
      const plan = session.user.currUsr.plan;
      const memCk = plan.memCk;
      const planId = plan.grpId; // Use grpId instead of non-existent planId

      console.log('[ChatWidget] Session plan data:', {
        memCk,
        planId,
        fullPlan: plan,
      });

      // Added direct test fetch to verify API endpoint is accessible
      // This is a temporary debug measure
      const debugRequestId = Date.now().toString();
      if (memCk && planId) {
        console.log('[ChatWidget] TEST: Direct fetch to API endpoint with:', {
          memCk,
          planId,
          debugRequestId,
        });

        fetch(
          `/api/chat/getChatInfo?memberId=${memCk}&memberType=byMemberCk&planId=${planId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-correlation-id': debugRequestId,
            },
          },
        )
          .then(async (response) => {
            console.log('[ChatWidget] TEST: Direct API response:', {
              status: response.status,
              ok: response.ok,
              contentType: response.headers.get('content-type'),
            });

            if (response.ok) {
              const text = await response.text();
              console.log(
                '[ChatWidget] TEST: API response text:',
                text.substring(0, 500),
              );
              try {
                const data = JSON.parse(text);
                console.log(
                  '[ChatWidget] TEST: Parsed API response data:',
                  data,
                );
              } catch (e) {
                console.error(
                  '[ChatWidget] TEST: Failed to parse API response:',
                  e,
                );
              }
            }
          })
          .catch((err) => {
            console.error('[ChatWidget] TEST: Direct API call failed:', err);
          });
      }

      if (memCk && planId) {
        console.log('[ChatWidget] Calling loadChatConfiguration with:', {
          memCk,
          planId,
          timestamp: new Date().toISOString(),
        });

        loadChatConfiguration(memCk, planId)
          .then(() => {
            console.log('[ChatWidget] Chat configuration loaded successfully', {
              timestamp: new Date().toISOString(),
              hasChatData: !!useChatStore.getState().chatData,
              chatData: useChatStore.getState().chatData,
            });
          })
          .catch((err) => {
            console.error(
              '[ChatWidget] Failed to load chat configuration',
              err,
            );
          });
      } else {
        console.warn(
          '[ChatWidget] Cannot load chat configuration - missing memCk or planId',
        );
      }
    } else {
      console.log('[ChatWidget] Not loading chat configuration:', {
        isLoading,
        hasChatData: !!chatData,
        hasSessionUser: !!session?.user,
        hasSessionUserPlan: !!session?.user?.currUsr?.plan,
        sessionUser: session?.user ? 'exists' : null,
        sessionPlan: session?.user?.currUsr?.plan
          ? {
              memCk: session?.user?.currUsr?.plan?.memCk,
              grpId: session?.user?.currUsr?.plan?.grpId,
            }
          : null,
      });
    }
  }, [chatData, isLoading, session, loadChatConfiguration]);

  useEffect(() => {
    logger.info('[ChatWidget] Chat component mounted', {
      chatMode,
      isOpen,
      isChatActive,
    });
    // eslint-disable-next-line no-console
    console.log('[ChatWidget] Chat component mounted', {
      chatMode,
      isOpen,
      isChatActive,
      chatData,
      chatSettings,
    });
  }, [chatMode, isOpen, isChatActive, chatData, chatSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const combinedSettings = {
        ...chatSettings,
        // Override cloudChatEligible with the value from chatData if available
        ...(chatData && { cloudChatEligible: chatData.cloudChatEligible }),
        // Ensure mode is set correctly
        chatMode: chatMode,
      };

      window.chatSettings = combinedSettings;

      logger.info('[ChatWidget] window.chatSettings set', { combinedSettings });
      // eslint-disable-next-line no-console
      console.log('[ChatWidget] window.chatSettings set', window.chatSettings);
    }
  }, [chatSettings, chatData, chatMode]);

  // Add a useEffect to log just before rendering the Script tag
  useEffect(() => {
    if (typeof window !== 'undefined' && chatSettings) {
      // Only log if chatSettings is present
      console.log(
        '[ChatWidget] About to render click_to_chat.js',
        window.chatSettings,
      );
    }
  }, [chatSettings]);

  useEffect(() => {
    // Run diagnostics on chatSettings and window.chatSettings
    logChatConfigDiagnostics(
      chatSettings,
      typeof window !== 'undefined' ? window.chatSettings : undefined,
      true,
    );
    validateChatConfig(
      chatSettings,
      typeof window !== 'undefined' ? window.chatSettings : undefined,
    );
  }, [chatSettings]);

  // Don't render chat on excluded paths or if user isn't authenticated with a plan
  if (
    excludedPaths.some((path) => pathname.startsWith(path)) ||
    !session?.user?.currUsr?.plan
  ) {
    return null;
  }

  // ALWAYS load the script, but conditionally render additional chat UI
  const scriptComponent = (
    <>
      <Script
        src="/assets/genesys/click_to_chat.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            // Re-apply latest settings when script loads
            const combinedSettings = {
              ...chatSettings,
              ...(chatData && {
                cloudChatEligible: chatData.cloudChatEligible,
              }),
              chatMode: chatMode,
              // Add debug information to track initialization
              debug: true,
              timestamp: new Date().toISOString(),
              loadedFromComponent: 'ChatWidget',
            };

            // Log before setting to see what we're about to apply
            console.log(
              '[ChatWidget] Before applying settings to window.chatSettings:',
              {
                currentWindowSettings: window.chatSettings
                  ? Object.keys(window.chatSettings)
                  : 'none',
                willApply: combinedSettings,
                hasRequiredFields: {
                  chatMode: !!combinedSettings.chatMode,
                  isChatEligibleMember: !!combinedSettings.isChatEligibleMember,
                  isChatAvailable:
                    combinedSettings.isChatAvailable !== undefined,
                },
              },
            );

            window.chatSettings = combinedSettings;

            // Force refresh _genesys widgets config if it exists
            if (window._genesys && window._genesys.widgets) {
              console.log(
                '[ChatWidget] Found _genesys.widgets, attempting to refresh config',
              );
              try {
                // Try to refresh the chat button via Genesys command bus if available
                if (
                  window.CXBus &&
                  typeof window.CXBus.command === 'function'
                ) {
                  console.log(
                    '[ChatWidget] Calling CXBus to refresh chat button',
                  );
                  window.CXBus.command(
                    'WebChat.refreshSettings',
                    combinedSettings,
                  );
                }
              } catch (e) {
                console.error(
                  '[ChatWidget] Error refreshing Genesys settings:',
                  e,
                );
              }
            }

            logger.info(
              '[ChatWidget] click_to_chat.js loaded with settings',
              window.chatSettings,
            );

            console.log(
              '[ChatWidget] click_to_chat.js loaded with complete settings:',
              window.chatSettings,
            );
          }
        }}
      />
      {/* Custom CSS overrides for Genesys chat widget styling */}
      <Script
        id="chat-custom-css"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Load our custom CSS after the Genesys widget styles
            (function() {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = '/assets/genesys/styles/bcbst-custom.css';
              link.type = 'text/css';
              
              // Ensure this loads after Genesys styles
              document.head.appendChild(link);
              
              console.log('[ChatWidget] Custom CSS loaded');
            })();
          `,
        }}
      />
    </>
  );

  // If chat is not open, just return the script without the UI
  if (!isOpen) {
    return scriptComponent;
  }

  // If chat is open, render both the script and any additional UI components
  return (
    <>
      {scriptComponent}
      {/* Additional chat UI components can be added here when needed */}
    </>
  );
}
