'use client';
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { useChatStore } from '@/app/chat/stores/chatStore';
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

  // Debug chat settings - VERY IMPORTANT
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('ChatSettings from store:', {
      token: chatSettings?.token ? '✓ Present' : '✗ Missing',
      clickToChatEndpoint: chatSettings?.clickToChatEndpoint,
      chatData: chatData
        ? {
            chatGroup: chatData.chatGroup,
            isEligible: chatData.isEligible,
            // Add other properties as needed
          }
        : 'No chat data',
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
  }, [chatSettings, chatData]);

  // Step 1: Load the core Genesys widgets script first
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('[ChatScriptLoader] Beginning script load sequence');

    try {
      // Hard-code script paths to avoid any issues with dynamic path construction
      const WIDGETS_SCRIPT_PATH = '/assets/genesys/plugins/widgets.min.js';

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
      // Hard-code the script path
      const CLICK_TO_CHAT_PATH = '/assets/genesys/click_to_chat.js';

      // First, initialize chat settings object BEFORE loading click_to_chat.js
      // Use string values for everything to avoid object serialization issues
      (window as any).chatSettings = {
        isChatEligibleMember: 'true',
        isChatAvailable: 'true',
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
        clickToChatEndpoint:
          typeof chatSettings?.clickToChatEndpoint === 'string'
            ? chatSettings.clickToChatEndpoint
            : chatSettings?.clickToChatEndpoint
              ? JSON.stringify(chatSettings.clickToChatEndpoint)
              : '',
        opsPhone: '1-800-123-4567',
        opsPhoneHours: '24/7',
        chatHours: '24/7',
        rawChatHours: 'S_S_24',
        isMedical: 'true',
        isDental: 'false',
        isVision: 'false',
      };

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
  }, [widgetsLoaded, chatData, chatSettings]);

  // Step 3: Create the chat button if needed
  useEffect(() => {
    if (!clickToChatLoaded || typeof window === 'undefined') return;

    console.log('[ChatScriptLoader] Initializing chat button');

    // Give time for scripts to initialize
    const timeoutId = setTimeout(() => {
      // Force enable the chat button
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
        console.warn('[ChatScriptLoader] enableChatButton function not found');
        createFallbackButton();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [clickToChatLoaded]);

  // Function to create a fallback button if needed
  function createFallbackButton() {
    console.log('[ChatScriptLoader] Creating fallback button');
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
    console.log('[ChatScriptLoader] Fallback button created');
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
  return (
    <>
      <link rel="stylesheet" href="/assets/genesys/plugins/widgets.min.css" />
      <div id="genesys-chat-container"></div>
      <ClientOnly>
        <ChatScriptLoader />
      </ClientOnly>
    </>
  );
}

export default LegacyChatWrapper;
