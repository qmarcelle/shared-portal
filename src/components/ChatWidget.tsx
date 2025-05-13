'use client';

import { useChatSetup } from '@/app/chat/hooks/useChatSetup';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

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
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
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

  // Use a fallback for chatMode if cloudChatEligible is undefined
  const chatMode = chatData?.cloudChatEligible === true ? 'cloud' : 'legacy';

  useChatSetup(chatMode);

  // Function to force create and style the chat button
  const forceCreateChatButton = () => {
    if (typeof window === 'undefined') return;
    console.log('[ChatWidget] Forcing chat button creation');

    // Remove any existing button first to avoid duplicates
    const existingButtons = document.querySelectorAll(
      '.cx-webchat-chat-button, .fallback-chat-button',
    );
    existingButtons.forEach((btn) => btn.remove());

    // Create a chat button that matches the Genesys styling
    const chatButton = document.createElement('div');
    chatButton.className = 'cx-widget cx-webchat-chat-button cx-side-button';
    chatButton.innerText = 'Chat Now';

    // Apply inline styles directly from bcbst-custom.css
    Object.assign(chatButton.style, {
      display: 'flex',
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      backgroundColor: '#0056B3',
      color: 'white',
      borderRadius: '4px',
      padding: '10px 20px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontWeight: '500',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      border: 'none',
      zIndex: '9999',
      cursor: 'pointer',
      opacity: '1',
      visibility: 'visible',
    });

    // Set up click handler
    chatButton.onclick = () => {
      if (typeof window !== 'undefined' && (window as any).CXBus) {
        try {
          console.log('[ChatWidget] Opening chat with CXBus');
          (window as any).CXBus.command('WebChat.open');
        } catch (err) {
          console.error('[ChatWidget] Error opening chat with CXBus', err);

          // Try direct approach if CXBus fails
          if ((window as any)._genesys?.widgets?.main) {
            try {
              (window as any)._genesys.widgets.main.startChat({
                userData: {
                  customerId: session?.user?.currUsr?.plan?.memCk || 'unknown',
                  groupId: session?.user?.currUsr?.plan?.grpId || 'unknown',
                },
              });
            } catch (e) {
              console.error('[ChatWidget] Failed to start chat directly', e);
              alert('Chat could not be started. Please try again later.');
            }
          }
        }
      } else {
        alert('Chat system is loading. Please try again in a moment.');
      }
    };

    // Add the button to the page
    document.body.appendChild(chatButton);
    setChatButtonExists(true);
    console.log('[ChatWidget] Force-created chat button');
  };

  // Trigger loadChatConfiguration if needed and we have a session with plan
  useEffect(() => {
    if (!chatData && session?.user?.currUsr?.plan) {
      const plan = session.user.currUsr.plan;
      const memCk = plan.memCk;
      const planId = plan.grpId;

      if (memCk && planId) {
        console.log('[ChatWidget] Loading chat configuration', {
          memCk,
          planId,
        });
        loadChatConfiguration(memCk, planId);
      }
    }
  }, [chatData, session, loadChatConfiguration]);

  // Setup Genesys config
  useEffect(() => {
    if (typeof window === 'undefined' || !session?.user?.currUsr?.plan) return;

    // Setup Genesys configuration
    console.log('[ChatWidget] Setting up Genesys configuration');

    // Initialize _genesys object
    (window as any)._genesys = (window as any)._genesys || { widgets: {} };

    // Configure chat
    const combinedSettings = {
      ...chatSettings,
      ...(chatData && { cloudChatEligible: chatData.cloudChatEligible }),
      chatMode: chatMode,
      isChatEligibleMember: 'true',
      isDemoMember: 'true',
      isChatAvailable: 'true',
    };

    // Set the chat settings for the Genesys scripts to use
    (window as any).chatSettings = combinedSettings;

    // Configure the chat button immediately
    (window as any)._genesys.widgets.webchat = {
      chatButton: {
        enabled: true,
        template:
          '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
        openDelay: 100,
        effectDuration: 200,
        hideDuringInvite: false,
      },
    };

    // Setup onReady handler
    (window as any)._genesys.widgets.onReady = function () {
      console.log('[ChatWidget] Genesys widgets ready');
      // Check for button after a delay
      setTimeout(checkForChatButton, 1000);
    };

    logger.info('[ChatWidget] Genesys configuration complete');
  }, [chatSettings, chatData, chatMode, session?.user?.currUsr?.plan]);

  // Using forceCreateChatButton instead of this method

  // Check if the chat button exists
  const checkForChatButton = () => {
    if (typeof window === 'undefined') return false;

    const genesysButton = document.querySelector('.cx-webchat-chat-button');
    if (genesysButton) {
      setChatButtonExists(true);
      return true;
    }

    return false;
  };

  // Single fallback check if scripts are loaded but no button
  useEffect(() => {
    if (!scriptsLoaded) return;

    // Check for button after scripts load
    const checkInterval = setInterval(() => {
      if (checkForChatButton()) {
        clearInterval(checkInterval);
      }
    }, 1000);

    // Use our force-create method after 3 seconds if no button
    const fallbackTimer = setTimeout(() => {
      if (!checkForChatButton()) {
        forceCreateChatButton();
      }
      clearInterval(checkInterval);
    }, 3000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(fallbackTimer);
    };
  }, [scriptsLoaded]);

  // Extra safety - create button after 5 seconds regardless of script status
  useEffect(() => {
    const finalFallbackTimer = setTimeout(() => {
      if (!checkForChatButton()) {
        forceCreateChatButton();
      }
    }, 5000);

    return () => clearTimeout(finalFallbackTimer);
  }, []);

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
          Chat status: {scriptsLoaded ? 'Scripts loaded' : 'Scripts loading'} |{' '}
          {chatButtonExists ? 'Button exists' : 'No button yet'}
        </div>
      )}

      {/* Load CSS files first in head to ensure they're available */}
      <link
        rel="stylesheet"
        href="/assets/genesys/plugins/widgets.min.css"
        id="genesys-widgets-css"
      />
      <link
        rel="stylesheet"
        href="/assets/genesys/styles/bcbst-custom.css"
        id="genesys-custom-css"
      />

      {/* Load config script first with beforeInteractive strategy */}
      <Script
        id="genesys-config-script"
        src="/assets/genesys/click_to_chat.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('[ChatWidget] Config script loaded')}
      />

      {/* Load widgets script after with afterInteractive strategy */}
      <Script
        id="genesys-widgets-script"
        src="/assets/genesys/plugins/widgets.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[ChatWidget] Widgets script loaded');
          setScriptsLoaded(true);

          // Try to find the button after script loads
          setTimeout(checkForChatButton, 1000);
        }}
        onError={() => {
          console.error('[ChatWidget] Widgets script failed to load');
          // Create button immediately on error
          forceCreateChatButton();
        }}
      />

      {/* Inline style to ensure chat button is visible regardless of CSS loading */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cx-widget.cx-webchat-chat-button {
          display: flex !important;
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
          background-color: #0056B3 !important;
          color: white !important;
          border-radius: 4px !important;
          padding: 10px 20px !important;
          font-family: 'Helvetica Neue', Arial, sans-serif !important;
          font-weight: 500 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          border: none !important;
          z-index: 9999 !important;
          cursor: pointer !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `,
        }}
      />
    </div>
  );
}
