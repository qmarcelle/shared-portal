'use client';

import { useState, useEffect } from 'react';
import styles from './ChatButton.module.css';

interface ChatButtonProps {
  text?: string;
  customClass?: string;
}

export function ChatButton({ text = 'Chat Now', customClass = '' }: ChatButtonProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Function to open chat using multiple available methods
  const openChat = () => {
    console.log('[ChatButton] Opening chat');
    
    // Try multiple methods to open chat
    try {
      // Method 1: CXBus command
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        console.log('[ChatButton] Opening chat via CXBus.command');
        window.CXBus.command('WebChat.open');
        return;
      }
      
      // Method 2: Direct widget access
      if (window._genesys && window._genesys.widgets && window._genesys.widgets.webchat) {
        console.log('[ChatButton] Opening chat via _genesys.widgets.webchat');
        window._genesys.widgets.webchat.open();
        return;
      }
      
      // Method 3: Legacy method
      if (typeof window.startChat === 'function') {
        console.log('[ChatButton] Opening chat via legacy startChat function');
        window.startChat();
        return;
      }
      
      // Method 4: openGenesysChat global function
      if (typeof window.openGenesysChat === 'function') {
        console.log('[ChatButton] Opening chat via openGenesysChat function');
        window.openGenesysChat();
        return;
      }
      
      console.warn('[ChatButton] No chat method available');
    } catch (err) {
      console.error('[ChatButton] Error opening chat:', err);
    }
  };

  // Check if native Genesys button is visible and hide our custom button if it is
  useEffect(() => {
    const checkNativeButton = () => {
      const nativeButton = document.querySelector('.cx-webchat-chat-button');
      if (nativeButton && nativeButton.getBoundingClientRect().height > 0) {
        console.log('[ChatButton] Native Genesys button found, hiding custom button');
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Initial check
    checkNativeButton();
    
    // Set up periodic checks
    const intervalId = setInterval(checkNativeButton, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  // If native button is visible, don't show our custom button
  if (!isVisible) {
    return null;
  }

  return (
    <button 
      onClick={openChat}
      className={`${styles.chatButton} ${customClass}`}
      aria-label="Start chat with customer support"
    >
      <svg 
        className={styles.chatIcon}
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
          clipRule="evenodd"
        />
      </svg>
      {text}
    </button>
  );
}