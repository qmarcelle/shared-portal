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
      // Find all <a> tags containing 'start a chat' (case insensitive)
      const chatLinks = document.querySelectorAll('a');
      let newEnhanced = 0;

      chatLinks.forEach((link) => {
        const linkText = link.textContent?.toLowerCase().trim();
        if (
          linkText?.includes('start a chat') ||
          linkText?.includes('chat with us')
        ) {
          // Skip if already enhanced
          if (link.getAttribute('data-chat-enhanced') === 'true') return;

          // Store original click handler if any
          const originalOnClick = link.onclick;

          // Set new click handler
          link.onclick = (e) => {
            e.preventDefault();
            // Call original handler if it exists
            if (originalOnClick) originalOnClick.call(link, e);
            // Open chat
            setOpen(true);
          };

          // Mark as enhanced
          link.setAttribute('data-chat-enhanced', 'true');

          // Add proper ARIA attributes
          link.setAttribute('role', 'button');
          link.setAttribute('aria-label', 'Open chat window');

          // Add cursor pointer if not already styled
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

        // Update sequential loader state
        markDomEnhancementComplete(enhancedCount.current);
      }
    };

    // Run enhancement on initial load
    enhanceChatLinks();

    // Set up a mutation observer to handle dynamically added links
    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        let shouldEnhance = false;

        // Only run enhancer if we found new links
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if any added node is an <a> tag or contains one
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

        if (shouldEnhance) {
          enhanceChatLinks();
        }
      });

      // Start observing changes to the DOM
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Clean up
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
