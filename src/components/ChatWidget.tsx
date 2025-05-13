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
import { useEffect, useMemo, useState } from 'react';

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
  // State to track if window.chatSettings is ready for script loading
  const [configReady, setConfigReady] = useState(false);

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
            }
          }, 2000);
        } else {
          console.warn('[ChatWidget] Genesys widgets not initialized yet');
        }
      };

      // Call immediately and also after a delay to ensure it works
      enableChatButton();
      setTimeout(enableChatButton, 3000);
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
        // Ensure these are set correctly for eligibility checks
        isChatEligibleMember: 'true', // Force to true for testing
        isDemoMember: chatSettings?.isDemoMember || 'true', // Fallback to true if not set
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
        />
      )}
      {configReady && !scriptLoaded && (
        <div
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            padding: '0.25rem 0.5rem',
            fontSize: '10px',
            color: '#666',
            background: '#f5f5f5',
            borderRadius: '3px',
            opacity: '0.8',
          }}
        >
          Loading chat...
        </div>
      )}
    </>
  );
}
