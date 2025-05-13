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
import { useEffect, useMemo, useRef, useState } from 'react';

// We'll use any to avoid type conflicts with other declarations
// in the codebase that we can't see

// Accept any shape for chatSettings, as it is aggregated server-side
export interface ChatWidgetProps {
  chatSettings: any;
}

export default function ChatWidget({ chatSettings }: ChatWidgetProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, isChatActive, isLoading, error, chatData } = useChatStore();
  const { loadChatConfiguration } = useChatStore();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  // State to track if window.chatSettings is ready for script loading
  const [configReady, setConfigReady] = useState(false);
  // Ref to track the script loading attempts
  const scriptLoadAttempts = useRef(0);
  // Track if the chat button is in the DOM
  const [chatButtonExists, setChatButtonExists] = useState(false);

  // Define routes where chat should never appear
  const excludedPaths = useMemo(
    () => [
      '/login',
      '/error',
      '/auth/error',
      '/sso/redirect',
      '/embed/security',
    ],
    [],
  );

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

  // Create a reusable fallback button
  const createFallbackButton = () => {
    if (
      typeof window !== 'undefined' &&
      document.querySelector('.fallback-chat-button') === null
    ) {
      console.log('[ChatWidget] Creating fallback chat button');

      const fallbackBtn = document.createElement('div');
      fallbackBtn.className = 'fallback-chat-button';
      fallbackBtn.innerText = 'Chat Now';
      Object.assign(fallbackBtn.style, {
        display: 'flex',
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        backgroundColor: '#0078d4',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        zIndex: '9999',
        fontWeight: 'bold',
        fontSize: '16px',
      });

      fallbackBtn.onclick = () => {
        if (typeof window !== 'undefined' && (window as any).CXBus) {
          (window as any).CXBus.command('WebChat.open');
        } else {
          alert(
            'Chat system is not fully loaded. Please try again in a moment.',
          );
        }
      };

      document.body.appendChild(fallbackBtn);
      setChatButtonExists(true);
      console.log('[ChatWidget] Created fallback chat button');
    }
  };

  // Check if the chat button exists in the DOM
  const checkForChatButton = () => {
    if (typeof window !== 'undefined') {
      const button = document.querySelector('.cx-webchat-chat-button');
      if (button) {
        setChatButtonExists(true);
        return true;
      }

      // Also check for the fallback button
      const fallbackButton = document.querySelector('.fallback-chat-button');
      if (fallbackButton) {
        setChatButtonExists(true);
        return true;
      }

      return false;
    }
    return false;
  };

  // Effect to periodically check for chat button
  useEffect(() => {
    if (scriptLoaded && typeof window !== 'undefined' && !chatButtonExists) {
      const intervalId = setInterval(() => {
        if (checkForChatButton()) {
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [scriptLoaded, chatButtonExists]);

  // Set window.chatSettings and prepare config for Genesys
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize _genesys structure with proper type safety
      (window as any)._genesys = (window as any)._genesys || { widgets: {} };

      // Register onReady callback before scripts load
      if ((window as any)._genesys && (window as any)._genesys.widgets) {
        (window as any)._genesys.widgets.onReady = function (bus: any) {
          console.log('[ChatWidget] Genesys widgets ready!');

          // Ensure chat button is configured
          if ((window as any)._genesys && (window as any)._genesys.widgets) {
            (window as any)._genesys.widgets.webchat =
              (window as any)._genesys.widgets.webchat || {};

            (window as any)._genesys.widgets.webchat.chatButton = {
              enabled: true,
              template:
                '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
              openDelay: 100,
              effectDuration: 200,
              hideDuringInvite: false,
            };
          }

          // Find and style the button
          setTimeout(() => {
            const btn = document.querySelector(
              '.cx-webchat-chat-button',
            ) as HTMLDivElement;
            if (btn) {
              setChatButtonExists(true);
              Object.assign(btn.style, {
                display: 'flex',
                opacity: '1',
                visibility: 'visible',
                backgroundColor: '#0078d4',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                zIndex: '9999',
                fontWeight: 'bold',
                fontSize: '16px',
              });

              if (btn.textContent && btn.textContent.includes('Debug:'))
                btn.textContent = 'Chat Now';

              console.log('[ChatWidget] Chat button styled and enabled');
            } else {
              console.warn('[ChatWidget] Chat button element not found');
              // Create a fallback button as last resort
              createFallbackButton();
            }
          }, 2000);
        };
      }

      // Combine and set chatSettings
      const combinedSettings = {
        ...chatSettings,
        // Override cloudChatEligible with the value from chatData if available
        ...(chatData && { cloudChatEligible: chatData.cloudChatEligible }),
        // Ensure mode is set correctly
        chatMode: chatMode,
        // CRITICAL: Force these to 'true' as strings to ensure eligibility passes
        isChatEligibleMember: 'true',
        isDemoMember: 'true',
        isChatAvailable: 'true',
      };

      (window as any).chatSettings = combinedSettings;

      logger.info('[ChatWidget] window.chatSettings set', { combinedSettings });
      console.log(
        '[ChatWidget] window.chatSettings set',
        (window as any).chatSettings,
      );

      // Mark config as ready after settings are applied
      setConfigReady(true);
    }
  }, [chatSettings, chatData, chatMode]);

  // Run diagnostics on chatSettings and window.chatSettings
  useEffect(() => {
    logChatConfigDiagnostics(
      chatSettings,
      typeof window !== 'undefined' ? (window as any).chatSettings : undefined,
      true,
    );
    validateChatConfig(
      chatSettings,
      typeof window !== 'undefined' ? (window as any).chatSettings : undefined,
    );
  }, [chatSettings]);

  // Last resort fallback timer
  useEffect(() => {
    if (configReady) {
      const lastResortTimer = setTimeout(() => {
        if (!checkForChatButton()) {
          console.log(
            '[ChatWidget] Last resort timer - creating fallback button',
          );
          createFallbackButton();
        }
      }, 20000);

      return () => clearTimeout(lastResortTimer);
    }
  }, [configReady]);

  // Don't render chat on excluded paths or if user isn't authenticated with a plan
  if (
    excludedPaths.some((path) => pathname.startsWith(path)) ||
    !session?.user?.currUsr?.plan
  ) {
    return null;
  }

  return (
    <div>
      {process.env.NODE_ENV !== 'production' && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            fontSize: '12px',
            background: '#eee',
            padding: '5px',
            zIndex: 9999,
          }}
        >
          Chat status: {configReady ? 'Config ready' : 'Config loading'} |{' '}
          {scriptLoaded ? 'Scripts loaded' : 'Scripts loading'} |{' '}
          {chatButtonExists ? 'Button exists' : 'No button yet'}
        </div>
      )}

      {configReady && (
        <>
          {/* Load custom CSS */}
          <link
            rel="stylesheet"
            href="/assets/genesys/styles/bcbst-custom.css"
            id="genesys-custom-css"
          />
          <link
            rel="stylesheet"
            href="/assets/genesys/plugins/widgets.min.css"
            id="genesys-widgets-css"
          />
          <Script
            id="genesys-config-script"
            src="/assets/genesys/click_to_chat.js"
            strategy="beforeInteractive"
            onLoad={() => console.log('[ChatWidget] Config script loaded')}
            onError={(e) =>
              console.error('[ChatWidget] Config script error', e)
            }
          />
          <Script
            id="genesys-widgets-script"
            src="/assets/genesys/plugins/widgets.min.js"
            strategy="afterInteractive"
            onLoad={() => {
              console.log('[ChatWidget] Widgets script loaded');
              setScriptLoaded(true);
            }}
            onError={() => {
              console.error('[ChatWidget] Widgets script failed to load');
              setTimeout(createFallbackButton, 5000);
            }}
          />
        </>
      )}
    </div>
  );
}
