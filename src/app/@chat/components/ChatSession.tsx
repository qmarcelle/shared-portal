'use client';
import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10min

// ChatSession manages the lifecycle of an active chat session.
// It handles agent typing, inactivity timeouts, and session state.
// All session events and state changes are logged for traceability and debugging.

export default function ChatSession() {
  const { isChatActive, endChat } = useChatStore();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [agentTyping, setAgentTyping] = useState(false);
  const pluginRef = useRef<any>(null);

  // Reset timer on user interaction
  useEffect(() => {
    if (!isChatActive) return;

    const handler = () => setLastActivity(Date.now());
    ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
      window.addEventListener(e, handler),
    );

    return () =>
      ['mousedown', 'keydown', 'touchstart'].forEach((e) =>
        window.removeEventListener(e, handler),
      );
  }, [isChatActive]);

  // Handle typing events
  useEffect(() => {
    if (!isChatActive) return;

    // This is the handler function that will work for both APIs
    const onTyping = (event: any) => {
      // Different APIs send the typing indicator in different formats
      const isTyping =
        typeof event?.typing === 'boolean'
          ? event.typing
          : typeof event?.data?.typing === 'boolean'
            ? event.data.typing
            : false;

      setAgentTyping(isTyping);
    };

    const cleanupFunctions: Array<() => void> = [];

    // Method 1: Using Genesys Cloud Messenger (MessengerWidget)
    // This uses a periodic check rather than direct initialization
    const messengerInterval = setInterval(() => {
      if (
        window.MessengerWidget &&
        typeof window.MessengerWidget.on === 'function'
      ) {
        try {
          window.MessengerWidget.on('typingIndicator', onTyping);
          // Clear the interval once we've successfully attached
          clearInterval(messengerInterval);

          // Add cleanup function
          cleanupFunctions.push(() => {
            try {
              if (window.MessengerWidget?.off) {
                window.MessengerWidget.off('typingIndicator', onTyping);
              }
            } catch (err) {
              console.error('Error cleaning up MessengerWidget events', err);
            }
          });
        } catch (err) {
          console.error(
            'Error attaching to MessengerWidget typing indicator',
            err,
          );
        }
      }
    }, 1000);

    // Method 2: Using Genesys Engage (CXBus)
    // This matches the pattern used in click_to_chat.js
    if (window._genesys?.widgets?.onReady) {
      window._genesys.widgets.onReady((CXBus: any) => {
        try {
          // Register a plugin - this is how click_to_chat.js does it
          const plugin = CXBus.registerPlugin('ChatSessionPlugin');
          pluginRef.current = plugin;

          // Subscribe to typing events using the plugin
          plugin.subscribe('WebChat.agentTyping', onTyping);

          // Add cleanup function
          cleanupFunctions.push(() => {
            try {
              if (plugin && typeof plugin.unsubscribe === 'function') {
                plugin.unsubscribe('WebChat.agentTyping', onTyping);
              }
            } catch (err) {
              console.error('Error cleaning up CXBus events', err);
            }
          });
        } catch (err) {
          console.error('Error initializing CXBus events', err);
        }
      });
    }

    // Return a cleanup function that calls all registered cleanup functions
    return () => {
      clearInterval(messengerInterval);
      cleanupFunctions.forEach((fn) => fn());
    };
  }, [isChatActive]);

  // Inactivity timeout
  useEffect(() => {
    if (!isChatActive) return;

    const id = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        endChat();
        alert('Your chat ended due to inactivity.');
      }
    }, 60 * 1000);

    return () => clearInterval(id);
  }, [isChatActive, lastActivity, endChat]);

  if (!isChatActive) return null;

  return agentTyping ? (
    <div className="agent-typing">Agent is typing...</div>
  ) : null;
}
