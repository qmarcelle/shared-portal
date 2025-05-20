'use client';

import { useChatStore } from '@/app/chat/stores/chatStore';
import {
  ChatLoadingState,
  markDomEnhancementComplete,
} from '@/app/chat/utils/chatSequentialLoader';
import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';

/**
 * ChatLinkEnhancer - Finds all links containing "start a chat" text and enhances them
 * to open the chat when clicked.
 *
 * This component should be mounted high in the component tree to affect the entire app.
 */
export function ChatLinkEnhancer() {
  const setOpen = useChatStore((state) => state.actions.setOpen);
  const enhancedCount = useRef(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const isSetupComplete = useRef(false);

  useEffect(() => {
    // Skip if already set up in this component instance
    if (isSetupComplete.current) return;

    // Skip if already enhanced according to sequential loader
    if (ChatLoadingState.domState.linksEnhanced) {
      logger.info(
        '[ChatLinkEnhancer] Already enhanced according to ChatLoadingState, skipping setup',
      );
      return;
    }

    isSetupComplete.current = true;

    // Wait for DOM to be fully loaded
    const enhanceChatLinks = () => {
      // Find all <a> tags containing 'start a chat' or 'chat with us' (case insensitive) an initial scan of the DOM.
      // This ensures links present at the time of component mount are processed.
      const chatLinks = document.querySelectorAll('a');
      let newEnhanced = 0;

      chatLinks.forEach((link) => {
        const linkText = link.textContent?.toLowerCase().trim();
        if (
          linkText?.includes('start a chat') ||
          linkText?.includes('chat with us')
        ) {
          // Skip if this specific link has already been enhanced to prevent duplicate event listeners.
          if (link.getAttribute('data-chat-enhanced') === 'true') return;

          // Store original click handler if any, to ensure existing functionality isn't lost.
          const originalOnClick = link.onclick;

          // Override the link's click behavior.
          link.onclick = (e) => {
            e.preventDefault(); // Prevent the default navigation behavior of the link.
            // Call original handler if it exists, maintaining original link behavior alongside chat opening.
            if (originalOnClick) originalOnClick.call(link, e);
            // Open chat by calling the setOpen action from the chat store.
            // This typically triggers the display of the PreChatModal or the main chat window.
            setOpen(true);
          };

          // Mark as enhanced by setting a custom data attribute.
          // This helps in identifying already processed links during subsequent scans or observer callbacks.
          link.setAttribute('data-chat-enhanced', 'true');

          // Add proper ARIA attributes to make the link behave more like a button for accessibility.
          link.setAttribute('role', 'button');
          link.setAttribute('aria-label', 'Open chat window');

          // Add cursor pointer if not already styled, to visually indicate it's clickable like a button.
          if (window.getComputedStyle(link).cursor !== 'pointer') {
            link.style.cursor = 'pointer';
          }

          newEnhanced++;
        }
      });

      if (newEnhanced > 0) {
        enhancedCount.current += newEnhanced;
        logger.info(
          `[ChatLinkEnhancer] Enhanced ${newEnhanced} new chat links. Total: ${enhancedCount.current}`,
        );

        // Update sequential loader state to indicate that link enhancement has occurred.
        markDomEnhancementComplete(enhancedCount.current);
      }
    };

    // Run enhancement on initial load after the component mounts and the DOM is available.
    enhanceChatLinks();

    // Set up a mutation observer to handle dynamically added links after the initial page load.
    // This is crucial for single-page applications (SPAs) where content changes without full page reloads.
    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        let shouldEnhance = false;

        // Only run enhancer if we found new links added to the DOM.
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if any added node is an <a> tag or contains one within its subtree.
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'A' || element.querySelector('a')) {
                  shouldEnhance = true;
                }
              }
            });
          }
        });

        // If new links were potentially added, re-run the enhancement process.
        if (shouldEnhance) {
          enhanceChatLinks();
        }
      });

      // Start observing changes to the document body and its entire subtree for additions of child elements.
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Clean up the MutationObserver when the component unmounts.
    // This prevents memory leaks and ensures the observer doesn't run unnecessarily after the component is gone.
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [setOpen]);

  // This component doesn't render anything
  return null;
}

// Add global flag to Window interface
declare global {
  interface Window {
    _chatLinkEnhancerActive?: boolean;
  }
}
