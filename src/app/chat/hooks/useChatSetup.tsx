import { logger } from '@/utils/logger';
import { useEffect, useId, useState } from 'react';
import { chatSelectors, useChatStore } from '../stores/chatStore';

type ChatMode = 'legacy' | 'cloud';

/**
 * Custom hook to handle common chat setup logic for both legacy and cloud chat components
 * Extracts shared functionality to reduce duplication between wrappers
 */
export function useChatSetup(chatMode: ChatMode) {
  const { chatData, isLoading } = useChatStore();
  const userData = chatSelectors.userData(useChatStore.getState());
  const [error, setError] = useState<Error | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [settingsInjected, setSettingsInjected] = useState(false);
  const componentId = useId(); // React 18's useId() for stable IDs

  // Log component mounting
  useEffect(() => {
    logger.info(`[useChatSetup] ${chatMode} chat setup initialized`, {
      componentId,
      hasUserData: !!userData && Object.keys(userData).length > 0,
      userDataKeys: userData ? Object.keys(userData) : [],
      chatMode,
      isLoading,
      timestamp: new Date().toISOString(),
    });

    // Debug log to console for visibility during development
    console.log(`[useChatSetup] ${chatMode} chat setup initialized`, {
      componentId,
      hasUserData: !!userData && Object.keys(userData).length > 0,
      userDataKeys: userData ? Object.keys(userData) : [],
      chatMode,
      chatData,
      isLoading,
    });

    return () => {
      logger.info(`[useChatSetup] ${chatMode} chat setup cleanup`, {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, [chatMode, componentId, isLoading, userData, chatData]);

  // Initialize chat settings based on userData
  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      logger.info(`[useChatSetup] Waiting for userData to be available`, {
        componentId,
        timestamp: new Date().toISOString(),
      });

      console.log(`[useChatSetup] Waiting for userData to be available`, {
        componentId,
        chatData,
        timestamp: new Date().toISOString(),
      });

      // Check if we need to load chat configuration
      if (!isLoading && !chatData) {
        console.log(
          '[useChatSetup] Need to load chat configuration - chatData not available',
        );
        // We could trigger loadChatConfiguration here if needed
      }

      return;
    }

    if (settingsInjected) return;

    logger.info(`[useChatSetup] userData is available, setting up chat`, {
      componentId,
      chatMode,
      userDataKeys: Object.keys(userData),
      timestamp: new Date().toISOString(),
    });

    console.log(`[useChatSetup] userData is available, setting up chat`, {
      componentId,
      chatMode,
      userDataKeys: Object.keys(userData),
      chatData,
    });

    try {
      // Override chatMode if chatData indicates differently
      const effectiveChatMode =
        chatData?.cloudChatEligible === true ? 'cloud' : 'legacy';

      if (effectiveChatMode !== chatMode) {
        console.log(
          `[useChatSetup] Overriding chat mode from ${chatMode} to ${effectiveChatMode} based on chatData`,
        );
      }

      // Use Zustand store action to create and sync settings
      const settings = useChatStore
        .getState()
        .initializeChatSettings(userData, effectiveChatMode);

      logger.info(`[useChatSetup] chatSettings injected`, {
        componentId,
        hasSettings: !!window.chatSettings,
        settingsKeys: Object.keys(window.chatSettings || {}),
        timestamp: new Date().toISOString(),
      });

      console.log(`[useChatSetup] chatSettings injected`, {
        componentId,
        hasSettings: !!window.chatSettings,
        settingsKeys: Object.keys(window.chatSettings || {}),
        settings,
      });

      setSettingsInjected(true);
    } catch (err) {
      logger.error(`[useChatSetup] Error injecting chat settings`, {
        componentId,
        error: err,
        timestamp: new Date().toISOString(),
      });

      console.error(`[useChatSetup] Error injecting chat settings`, {
        componentId,
        error: err,
      });

      setError(
        err instanceof Error
          ? err
          : new Error('Failed to inject chat settings'),
      );
    }
  }, [userData, componentId, chatMode, settingsInjected, chatData, isLoading]);

  return {
    userData,
    isLoading,
    error,
    setError,
    scriptsLoaded,
    setScriptsLoaded,
    componentId,
    chatData,
  };
}
