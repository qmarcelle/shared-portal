'use client';
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useEffect, useRef, useState } from 'react';
// ChatUI is deprecated and returns null anyway

/**
 * Legacy chat implementation wrapper
 * Handles loading Genesys chat scripts and creating chat button
 */
export function LegacyChatWrapper() {
  const scriptRef1 = useRef<HTMLScriptElement | null>(null);
  const scriptRef2 = useRef<HTMLScriptElement | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const chatData = useChatStore((state) => state.chatData);
  const chatSettings = useChatStore((state) => state.chatSettings);

  // Function to create a button if the Genesys scripts fail to load
  const createDebugButton = () => {
    if (typeof document === 'undefined') return;

    // Check if button already exists
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
      alert('Chat service is being configured. Please try again in a moment.');
    };

    document.body.appendChild(button);
  };

  // Load and initialize the chat scripts
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Create the settings object to be used by the scripts
    // Using type assertion to avoid TypeScript errors
    (window as any).chatSettings = {
      isChatEligibleMember: 'true',
      isChatAvailable: 'true',
      isDemoMember: 'true',
      chatGroup: chatData?.chatGroup || 'Default',
      formattedFirstName: 'Member',
      memberLastName: 'User',
      clickToChatToken: chatSettings?.token || '',
      clickToChatEndpoint: chatSettings?.serviceUrl || '',
      opsPhone: '1-800-123-4567',
      opsPhoneHours: '24/7',
      chatHours: '24/7',
      rawChatHours: 'S_S_24',
      isMedical: 'true',
      isDental: 'false',
      isVision: 'false',
    };

    // Load widgets.min.js
    if (!scriptRef1.current) {
      const script1 = document.createElement('script');
      script1.src = '/assets/genesys/plugins/widgets.min.js';
      script1.async = true;
      script1.onload = () => {
        logger.info('[LegacyChatWrapper] widgets.min.js loaded');

        // Only load second script after first one loads
        if (!scriptRef2.current) {
          const script2 = document.createElement('script');
          script2.src = '/assets/genesys/click_to_chat.js';
          script2.async = true;
          script2.onload = () => {
            logger.info('[LegacyChatWrapper] click_to_chat.js loaded');
            setScriptsLoaded(true);
          };
          script2.onerror = () => {
            logger.error('[LegacyChatWrapper] Failed to load click_to_chat.js');
            createDebugButton();
          };
          document.body.appendChild(script2);
          scriptRef2.current = script2;
        }
      };
      script1.onerror = () => {
        logger.error('[LegacyChatWrapper] Failed to load widgets.min.js');
        createDebugButton();
      };
      document.body.appendChild(script1);
      scriptRef1.current = script1;
    }

    // Cleanup function
    return () => {
      // Remove scripts when component unmounts
      if (scriptRef1.current && scriptRef1.current.parentNode) {
        scriptRef1.current.parentNode.removeChild(scriptRef1.current);
        scriptRef1.current = null;
      }
      if (scriptRef2.current && scriptRef2.current.parentNode) {
        scriptRef2.current.parentNode.removeChild(scriptRef2.current);
        scriptRef2.current = null;
      }
    };
  }, [chatData, chatSettings]);

  // Force chat button to be shown
  useEffect(() => {
    if (!scriptsLoaded) return;

    logger.info('[LegacyChatWrapper] Scripts loaded, checking for chat button');

    // Create a timeout to ensure the scripts have time to initialize
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Try to find the button
        const chatButton = document.querySelector('.cx-webchat-chat-button');

        if (chatButton) {
          logger.info('[LegacyChatWrapper] Chat button found, applying styles');
          chatButton.setAttribute(
            'style',
            'display: flex; opacity: 1; visibility: visible; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: fixed; right: 20px; bottom: 20px; z-index: 9999;',
          );

          // Ensure button text is correct
          if (chatButton.textContent?.includes('Debug:')) {
            chatButton.textContent = 'Chat Now';
          }
        } else {
          logger.warn(
            '[LegacyChatWrapper] No chat button found, creating debug button',
          );
          createDebugButton();
        }

        // Try to use the enableChatButton function if it exists
        if (typeof (window as any).enableChatButton === 'function') {
          logger.info('[LegacyChatWrapper] Calling enableChatButton()');
          (window as any).enableChatButton();
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [scriptsLoaded]);

  return <div id="genesys-chat-container"></div>;
}

export default LegacyChatWrapper;
