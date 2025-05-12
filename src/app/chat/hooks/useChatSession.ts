import { logger } from '@/utils/logger';
import { createContext, useCallback, useEffect, useMemo } from 'react';
import { ChatService } from '../services/ChatService';
import { useChatStore } from '../stores/chatStore';

// Context for ChatService (optional)
const ChatServiceContext = createContext<ChatService | null>(null);

// Utility: Parse business hours string - simplified
const parseBusinessHours = (hoursString: string) => {
  // Handle 24/7 format (S_S_24)
  if (hoursString.endsWith('_24')) {
    return { is24x7: true };
  }

  // Regular format parsing (e.g., MTWRF_9-17)
  const parts = hoursString.split('_');
  if (parts.length < 2) {
    return { is24x7: false, isValid: false };
  }

  const days = parts[0];
  const hours = parts[1];
  const hourParts = hours.split('-');

  if (hourParts.length !== 2) {
    return { days, is24x7: false, isValid: false };
  }

  const startHour = parseInt(hourParts[0], 10);
  const endHour = parseInt(hourParts[1], 10);

  return {
    days,
    startHour,
    endHour,
    is24x7: false,
    isValid: !isNaN(startHour) && !isNaN(endHour),
  };
};

const isWithinBusinessHours = (hoursString: string): boolean => {
  const hourInfo = parseBusinessHours(hoursString);

  // Always available for 24/7 service
  if (hourInfo.is24x7) return true;

  // Invalid format defaults to available
  if (!hourInfo.isValid) return true;

  // Check current time against business hours
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  // Type-safe day mapping
  const dayMap: Record<number, string> = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
  };

  // Check if current day is a business day
  const isBusinessDay =
    hourInfo.days === 'S' ||
    hourInfo.days?.includes(dayMap[currentDay]) ||
    false;

  return (
    isBusinessDay &&
    currentHour >= (hourInfo.startHour || 0) &&
    currentHour < (hourInfo.endHour || 24)
  );
};

// useChatSession is a custom hook that manages chat session state, service instantiation, and event subscriptions.
// It handles eligibility checks, chat actions, and logs all key events and errors for traceability and debugging.
export function useChatSession(options?: any) {
  // Store state and actions
  const {
    isOpen,
    isMinimized,
    isChatActive,
    error,
    eligibility,
    isLoading,
    setOpen,
    setMinimized,
    setError,
    setChatActive,
    setLoading,
    setEligibility,
    // ... rest of the state
  } = useChatStore();

  // Chat service instance
  const chatService = useMemo(() => {
    logger.info('[ChatSession] Creating ChatService instance', {
      memberId: options?.memberId,
      planId: options?.planId,
      hasConfig: !!options?.chatConfig,
    });

    return new ChatService(
      options?.memberId || '',
      options?.planId || '',
      options?.planName || '',
      options?.hasMultiplePlans || false,
      options?.onLockPlanSwitcher || (() => {}),
      // Pass the chatConfig from options
      options?.chatConfig || {},
    );
  }, [
    options?.memberId,
    options?.planId,
    options?.planName,
    options?.hasMultiplePlans,
    options?.onLockPlanSwitcher,
    options?.chatConfig, // Add chatConfig as a dependency
  ]);

  // Event subscriptions
  useEffect(() => {
    const subs: Array<() => void> = [];

    // Register event handlers for both legacy and cloud chat
    if (typeof window !== 'undefined') {
      // Legacy WebChat events
      if (window.CXBus) {
        window.CXBus?.on?.('WebChat.opened', () => setChatActive(true));
        window.CXBus?.on?.('WebChat.closed', () => setChatActive(false));
        window.CXBus?.on?.('WebChat.error', () => setChatActive(false));
        subs.push(
          () => window.CXBus?.runtime.unsubscribe?.('WebChat.opened'),
          () => window.CXBus?.runtime.unsubscribe?.('WebChat.closed'),
          () => window.CXBus?.runtime.unsubscribe?.('WebChat.error'),
        );
      }

      // Cloud Messenger events
      if (window.MessengerWidget) {
        window.MessengerWidget?.on?.('open', () => setChatActive(true));
        window.MessengerWidget?.on?.('close', () => setChatActive(false));
        window.MessengerWidget?.on?.('error', () => setChatActive(false));
        subs.push(
          () =>
            window.MessengerWidget?.off?.('open', () => setChatActive(true)),
          () =>
            window.MessengerWidget?.off?.('close', () => setChatActive(false)),
          () =>
            window.MessengerWidget?.off?.('error', () => setChatActive(false)),
        );
      }
    }

    return () => subs.forEach((unsub) => unsub());
  }, [setChatActive]);

  // Eligibility check
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setLoading(true);

        // Initialize the chat service first
        await chatService.initialize(options?.cloudChatEligible || false);

        // Get the eligibility info from the store
        // Note: Using eligibility directly from the store instead of chatInfo
        const storeEligibility = useChatStore.getState().eligibility;

        if (storeEligibility) {
          // Check hours availability
          const hoursAvailable = storeEligibility.workingHours
            ? isWithinBusinessHours(storeEligibility.workingHours)
            : true;

          // Determine eligibility based on all factors
          const isEligible =
            (storeEligibility.chatBotEligibility === true ||
              storeEligibility.chatAvailable === true) &&
            hoursAvailable;

          // Update with the latest eligibility including hours check
          setEligibility({ ...storeEligibility, isEligible, hoursAvailable });
        } else {
          logger.warn(
            '[ChatSession] No eligibility data found after initialization',
          );
          setEligibility(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        logger.error('[ChatSession] Error', { error: errorMessage });
        setError(
          err instanceof Error ? err : new Error('Failed to initialize chat'),
        );
        setEligibility(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [
    options?.memberId,
    options?.planId,
    setLoading,
    setError,
    setEligibility,
    chatService,
    options?.cloudChatEligible,
  ]);

  // Chat actions - simplified
  const openChat = useCallback(() => {
    if (!eligibility?.isEligible) {
      setError(new Error('Chat is not available'));
      return;
    }
    setOpen(true);
  }, [eligibility, setOpen, setError]);

  const closeChat = useCallback(() => setOpen(false), [setOpen]);
  const minimizeChat = useCallback(() => setMinimized(true), [setMinimized]);
  const maximizeChat = useCallback(() => setMinimized(false), [setMinimized]);

  const startChat = useCallback(async () => {
    if (!eligibility?.isEligible) {
      setError(new Error('Chat not available'));
      return;
    }

    try {
      setLoading(true);
      const payload = { ...options?.payload };
      await chatService.startChat(payload);
      setChatActive(true);
      options?.onLockPlanSwitcher?.(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start chat'));
    } finally {
      setLoading(false);
    }
  }, [eligibility, setLoading, setError, chatService, setChatActive, options]);

  const endChat = useCallback(async () => {
    try {
      setLoading(true);
      await chatService.endChat();
      setChatActive(false);
      options?.onLockPlanSwitcher?.(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to end chat'));
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, chatService, setChatActive, options]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!isChatActive) {
        setError(new Error('No active chat session'));
        return;
      }

      try {
        await chatService.sendMessage(text);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to send message'),
        );
      }
    },
    [isChatActive, chatService, setError],
  );

  return {
    isOpen,
    isMinimized,
    isChatActive,
    error,
    eligibility,
    isLoading,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    startChat,
    endChat,
    sendMessage,
  };
}
