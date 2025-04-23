'use client';

import { useEffect } from 'react';

/**
 * Type declarations for the Genesys global object
 */
declare global {
  interface Window {
    _genesys?: {
      widgets?: {
        main?: {
          debug?: boolean;
          lang?: string;
          plugins?: string[];
          header?: {
            Authorization?: string;
          };
        };
        webchat?: {
          dataURL?: string;
          chatButton?: {
            enabled?: boolean;
          };
        };
      };
    };
    Genesys?: {
      Chat?: unknown;
    };
  }
}

/**
 * LegacyChatLoader Component
 *
 * Implements the legacy Genesys chat widget by:
 * 1. Creating the global _genesys object with exact JSP parity
 * 2. Loading the on-prem chat.js script after config is ready
 */
export default function LegacyChatLoader() {
  useEffect(() => {
    // 1. Build the SAME _genesys object the JSP creates
    window._genesys ??= {};
    window._genesys.widgets ??= {};

    window._genesys.widgets.main = {
      debug: false,
      lang: 'en',
      plugins: ['cx-webchat-service', 'cx-webchat'],
      header: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_TOKEN}`,
      },
    };

    window._genesys.widgets.webchat = {
      dataURL: process.env.NEXT_PUBLIC_CHAT_REST,
      chatButton: { enabled: true },
    };

    // 2. Inject the legacy script once
    if (!document.getElementById('genesys-legacy')) {
      console.debug('[LEGACY] Injecting chat.js script');
      const s = document.createElement('script');
      s.id = 'genesys-legacy';
      s.src = '/chat.js';
      s.async = true;
      s.onload = () => {
        console.debug('[LEGACY] chat.js loaded ✓');
        console.debug('[LEGACY] Current _genesys config:', window._genesys);
      };
      s.onerror = (e) => {
        console.error('[LEGACY] Failed to load chat.js', e);
      };
      document.head.appendChild(s);
    }

    // Cleanup function
    return () => {
      // No cleanup needed as script loading is idempotent
    };
  }, []);

  return null;
}
