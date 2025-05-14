'use client';

/**
 * ChatWidget Component
 *
 * This component handles the integration with Genesys chat widget system.
 * It includes multiple strategies to ensure the chat button appears reliably:
 * 1. Properly sequenced CSS and script loading
 * 2. Configuration setup before script loading
 * 3. Multiple fallback mechanisms to guarantee button creation
 *
 * The component has been simplified from a complex implementation with many
 * overlapping fallbacks to a more streamlined approach.
 */

import { usePlanContext } from '@/app/chat/hooks/usePlanContext';
import { useUserContext } from '@/app/chat/hooks/useUserContext';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define a type that allows any chat settings structure
// This is more forgiving than trying to enforce a specific structure
interface ChatWidgetProps {
  chatSettings?: Record<string, any>;
}

export default function ChatWidget({ chatSettings = {} }: ChatWidgetProps) {
  logger.info('[ChatWidget] Component render start', {
    hasChatSettings: !!chatSettings,
    chatSettingsKeys: Object.keys(chatSettings),
  });

  // Initialization and script loading refs
  const initSequence = useRef(0);
  const MAX_INIT_ATTEMPTS = 5;
  const didInitialize = useRef(false);
  const didScriptsLoad = useRef(false);
  const mountCount = useRef(0);

  const { genesysChatConfig, isLoading, error, loadChatConfiguration } =
    useChatStore();
  const [scriptError, setScriptError] = useState(false);
  const lastConfig = useRef<any>(null);
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    error: planError,
    isPlanContextLoading,
  } = usePlanContext();

  // --- Component Lifecycle Tracking ---
  useEffect(() => {
    console.log('[ChatWidget] Component mounted');
    mountCount.current++;
    return () => {
      console.log('[ChatWidget] Component unmounted - cleaning up');
      // Reset refs on unmount to handle potential remounts
      initSequence.current = 0;
      didInitialize.current = false;
      didScriptsLoad.current = false;
    };
  }, []);

  // --- Initialization Effect ---
  useEffect(() => {
    // Guard against excessive initialization attempts
    initSequence.current += 1;
    console.log(
      `[ChatWidget] Initialization sequence ${initSequence.current}/${MAX_INIT_ATTEMPTS}`,
    );
    if (initSequence.current > MAX_INIT_ATTEMPTS) {
      console.error(
        '[ChatWidget] Exceeded maximum initialization attempts, breaking potential loop',
      );
      return;
    }
    if (didInitialize.current) {
      console.log(
        '[ChatWidget] Already initialized, skipping redundant initialization',
      );
      return;
    }
    if (isUserContextLoading || isPlanContextLoading) {
      console.log(
        '[ChatWidget] Contexts still loading, deferring initialization',
      );
      return;
    }
    if (!userContext?.memberId || !planContext?.planId) {
      console.warn(
        '[ChatWidget] Missing required context data for initialization',
      );
      return;
    }
    // Mark as initialized to prevent further attempts
    didInitialize.current = true;
    console.log('[ChatWidget] Proceeding with chat initialization');
    loadChatConfiguration(userContext.memberId, planContext.planId);
  }, [
    userContext,
    planContext,
    isUserContextLoading,
    isPlanContextLoading,
    loadChatConfiguration,
  ]);

  // --- Script Loading Effect ---
  useEffect(() => {
    // Only load scripts when config is ready and not already loaded
    if (!genesysChatConfig || didScriptsLoad.current) {
      return;
    }
    console.log(
      '[ChatWidget] Configuration ready, proceeding with script loading',
    );
    // Mark scripts as loaded before async operations to prevent race conditions
    didScriptsLoad.current = true;
    // Set up window objects
    window.chatSettings = genesysChatConfig;
    window.gmsServicesConfig = {
      GMSChatURL: () => genesysChatConfig.gmsChatUrl,
    };
    // Load scripts/styles (existing logic)
    const loadAllScripts = async () => {
      try {
        await loadStylesheet(
          '/assets/genesys/plugins/widgets.min.css',
          'genesys-widgets-css',
        );
        await loadStylesheet(
          '/assets/genesys/styles/bcbst-custom.css',
          'bcbst-custom-css',
        );
        await loadScript(
          '/assets/genesys/click_to_chat.js',
          'genesys-click-to-chat',
        );
        if (genesysChatConfig.chatMode === 'legacy') {
          await loadScript(
            '/assets/genesys/plugins/widgets.min.js',
            'genesys-widgets',
          );
        }
        console.log('[ChatWidget] All Genesys scripts/styles loaded');
      } catch (err) {
        console.error('[ChatWidget] Error loading Genesys scripts/styles', err);
        setScriptError(true);
      }
    };
    loadAllScripts();
    // No Cobrowse triggers here! Only user actions should call Cobrowse functions.
    return () => {
      // No script/style removal to avoid breaking other widgets
    };
  }, [genesysChatConfig]);

  // --- Utility functions (memoized) ---
  const scriptLoadTracker = useRef(new Set<string>());
  const loadScript = useCallback((src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id) || scriptLoadTracker.current.has(id)) {
        console.log(`[ChatWidget] Script ${id} already loaded, skipping`);
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => {
        scriptLoadTracker.current.add(id);
        console.log(`[ChatWidget] Script ${id} loaded`);
        resolve();
      };
      script.onerror = (err) => {
        console.error(`[ChatWidget] Script ${id} failed to load`, err);
        reject();
      };
      document.head.appendChild(script);
    });
  }, []);

  const loadStylesheet = useCallback((href: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id)) {
        console.log(`[ChatWidget] Stylesheet ${id} already loaded, skipping`);
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        console.log(`[ChatWidget] Stylesheet ${id} loaded`);
        resolve();
      };
      link.onerror = (err) => {
        console.error(`[ChatWidget] Stylesheet ${id} failed to load`, err);
        reject();
      };
      document.head.appendChild(link);
    });
  }, []);

  // --- Render logic (unchanged) ---
  const hasEffectiveConfig = !!genesysChatConfig;
  if (isUserContextLoading || isPlanContextLoading) {
    logger.info('[ChatWidget] Contexts still loading');
    return <div>Loading chat configuration...</div>;
  }
  if (!userContext) {
    logger.warn('[ChatWidget] No user context available');
    return null;
  }
  if (!planContext) {
    logger.warn('[ChatWidget] No plan context available');
    return planError ? (
      <div>Error loading chat: {planError.message}</div>
    ) : null;
  }
  if (!hasEffectiveConfig) {
    logger.warn('[ChatWidget] No chat configuration available');
    return null;
  }
  if (scriptError) {
    logger.error('[ChatWidget] Script error state, returning error UI');
    return <div>Failed to load chat widget.</div>;
  }
  logger.info('[ChatWidget] Render complete, returning widget UI');
  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Chat unavailable: {error.message}</div>;
  return (
    <div id="genesys-chat-widget-container">
      {/* Chat widget UI goes here */}
    </div>
  );
}
