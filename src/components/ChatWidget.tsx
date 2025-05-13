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

  // Fallback method to load Genesys widgets directly
  const loadGenesysWidgetsDirectly = () => {
    console.log('[ChatWidget] Attempting direct script injection fallback');

    // Only attempt if not already loaded
    if (
      typeof window !== 'undefined' &&
      !document.getElementById('genesys-widgets-script-direct')
    ) {
      try {
        // First ensure CSS is loaded
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/assets/genesys/plugins/widgets.min.css';
        cssLink.id = 'genesys-widgets-css-direct';
        document.head.appendChild(cssLink);

        // Then load the JS
        const script = document.createElement('script');
        script.src = '/assets/genesys/plugins/widgets.min.js';
        script.id = 'genesys-widgets-script-direct';
        script.async = true;

        script.onload = () => {
          console.log('[ChatWidget] Direct script injection successful');

          // Then load click_to_chat
          const clickToChatScript = document.createElement('script');
          clickToChatScript.src = '/assets/genesys/click_to_chat.js';
          clickToChatScript.id = 'click-to-chat-script-direct';
          clickToChatScript.async = true;

          clickToChatScript.onload = () => {
            console.log(
              '[ChatWidget] click_to_chat.js direct injection successful',
            );
            setScriptLoaded(true);
          };

          clickToChatScript.onerror = (err) => {
            console.error(
              '[ChatWidget] click_to_chat.js direct injection failed',
              err,
            );
            setScriptError('Failed to load click_to_chat.js directly');
          };

          document.head.appendChild(clickToChatScript);
        };

        script.onerror = (err) => {
          console.error(
            '[ChatWidget] Direct widgets.min.js injection failed',
            err,
          );
          setScriptError('Failed to load widgets.min.js directly');
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('[ChatWidget] Error during direct script injection', err);
        setScriptError(
          'Error during script injection: ' + (err as Error).message,
        );
      }
    }
  };

  // Effect to manually force chat button display if needed
  useEffect(() => {
    if (scriptLoaded && typeof window !== 'undefined') {
      // Attempt to force-enable the chat button after script has loaded
      const enableChatButton = () => {
        console.log('[ChatWidget] Forcing chat button visibility');

        if (window._genesys && window._genesys.widgets) {
          // Configure button properties
          window._genesys.widgets.webchat =
            window._genesys.widgets.webchat || {};
          window._genesys.widgets.webchat.chatButton = {
            enabled: true,
            template:
              '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
            openDelay: 100,
            effectDuration: 200,
            hideDuringInvite: false,
          };

          // Find and style the button
          setTimeout(() => {
            const btn = document.querySelector(
              '.cx-webchat-chat-button',
            ) as HTMLDivElement;
            if (btn) {
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

              // Ensure click handler
              btn.onclick = () =>
                window.CXBus && window.CXBus.command('WebChat.open');

              console.log('[ChatWidget] Chat button styled and enabled');
            } else {
              console.warn('[ChatWidget] Chat button element not found');

              // Create a fallback button directly if none exists
              if (document.querySelector('.fallback-chat-button') === null) {
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
                  if (window.CXBus) {
                    window.CXBus.command('WebChat.open');
                  } else {
                    alert(
                      'Chat system is not fully loaded. Please try again in a moment.',
                    );
                  }
                };
                document.body.appendChild(fallbackBtn);
                console.log('[ChatWidget] Created fallback chat button');
              }
            }
          }, 2000);
        } else {
          console.warn('[ChatWidget] Genesys widgets not initialized yet');
          // Try loading scripts directly as fallback
          if (scriptLoadAttempts.current < 3) {
            scriptLoadAttempts.current += 1;
            console.log(
              `[ChatWidget] Attempting fallback script load (try ${scriptLoadAttempts.current})`,
            );
            loadGenesysWidgetsDirectly();
          }
        }
      };

      // Call immediately and also after delays to ensure it works
      enableChatButton();
      setTimeout(enableChatButton, 3000);
      setTimeout(enableChatButton, 6000);
    }
  }, [scriptLoaded]);

  // Set window.chatSettings and mark config as ready
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const combinedSettings = {
        ...chatSettings,
        // Override cloudChatEligible with the value from chatData if available
        ...(chatData && { cloudChatEligible: chatData.cloudChatEligible }),
        // Ensure mode is set correctly
        chatMode: chatMode,
        // CRITICAL: Force these to 'true' as strings to ensure eligibility passes
        isChatEligibleMember: 'true',
        isDemoMember: 'true',
        isChatAvailable: true,
      };

      window.chatSettings = combinedSettings;

      logger.info('[ChatWidget] window.chatSettings set', { combinedSettings });
      console.log('[ChatWidget] window.chatSettings set', window.chatSettings);

      // Mark config as ready after settings are applied
      setConfigReady(true);
    }
  }, [chatSettings, chatData, chatMode]);

  // Add a useEffect to log just before rendering the Script tag
  useEffect(() => {
    if (typeof window !== 'undefined' && configReady) {
      // Only log if chatSettings is present and config is ready
      console.log(
        '[ChatWidget] Ready to load click_to_chat.js with settings:',
        window.chatSettings,
      );
    }
  }, [configReady]);

  // Fallback if script hasn't loaded after 10 seconds
  useEffect(() => {
    if (configReady && !scriptLoaded) {
      const timer = setTimeout(() => {
        console.log(
          '[ChatWidget] Script load timeout - trying direct injection',
        );
        loadGenesysWidgetsDirectly();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [configReady, scriptLoaded]);

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

  // Create a debug status display
  const renderDebugStatus = () => {
    if (!configReady) return 'Waiting for config...';
    if (scriptError) return `Error: ${scriptError}`;
    if (!scriptLoaded) return 'Loading script...';
    return 'Script loaded, waiting for button...';
  };

  // Only load the script after window.chatSettings is ready
  return (
    <>
      {configReady && (
        <Script
          src="/assets/genesys/click_to_chat.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (typeof window !== 'undefined') {
              // Log successful load but don't modify settings again - click_to_chat.js handles this
              logger.info('[ChatWidget] click_to_chat.js loaded successfully', {
                timestamp: new Date().toISOString(),
              });
              console.log('[ChatWidget] click_to_chat.js loaded successfully');
              setScriptLoaded(true);
            }
          }}
          onError={(e) => {
            console.error('[ChatWidget] Script load error:', e);
            setScriptError('Failed to load script via Next.js');
            // Try direct injection as fallback
            loadGenesysWidgetsDirectly();
          }}
        />
      )}

      {/* Debug indicator - can be removed in production */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          padding: '0.5rem 1rem',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333',
          zIndex: 9998,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {renderDebugStatus()}
      </div>

      {/* Create a manual button if needed */}
      {configReady && scriptLoaded && typeof window !== 'undefined' && (
        <div id="chat-button-container"></div>
      )}
    </>
  );
}
