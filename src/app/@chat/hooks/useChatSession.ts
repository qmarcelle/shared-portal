import { logger } from '@/utils/logger'; // Add logger import
import { createContext, useCallback, useEffect, useMemo } from 'react';
import { ChatService } from '../services/ChatService';
import { useChatStore } from '../stores/chatStore';
// import { ChatDataPayload, ChatError, ChatInfoResponse } from '../types'; // Use correct types if available

// Context for ChatService (optional, for provider pattern)
const ChatServiceContext = createContext<ChatService | null>(null);

// Utility: Parse business hours string
const parseBusinessHours = (hoursString: string) => {
  const [days, hours] = hoursString.split('_');
  const [startHour, endHour] = hours.split('-').map(Number);
  return {
    days,
    startHour,
    endHour,
    isValid: !isNaN(startHour) && !isNaN(endHour),
  };
};

const isWithinBusinessHours = (businessHours: string): boolean => {
  const { days, startHour, endHour, isValid } =
    parseBusinessHours(businessHours);
  if (!isValid) return false;
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  const isBusinessDay = days.includes(
    ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][currentDay],
  );
  return isBusinessDay && currentHour >= startHour && currentHour < endHour;
};

export function useChatSession(options?: any) {
  // Zustand state and actions
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
    setPlanSwitcherLocked,
    updateConfig,
  } = useChatStore();

  // Service instance
  const chatService = useMemo(
    () =>
      new ChatService(
        options?.memberId,
        options?.planId,
        options?.planName,
        options?.hasMultiplePlans,
        options?.onLockPlanSwitcher,
      ),
    [
      options?.memberId,
      options?.planId,
      options?.planName,
      options?.hasMultiplePlans,
      options?.onLockPlanSwitcher,
    ],
  );

  // Event subscriptions (Genesys, MessengerWidget, CXBus)
  useEffect(() => {
    // Legacy WebChat events
    const subs: Array<() => void> = [];
    if (typeof window !== 'undefined' && window.CXBus) {
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
    if (typeof window !== 'undefined' && window.MessengerWidget) {
      window.MessengerWidget?.on?.('open', () => setChatActive(true));
      window.MessengerWidget?.on?.('close', () => setChatActive(false));
      window.MessengerWidget?.on?.('error', () => setChatActive(false));
      subs.push(
        () => window.MessengerWidget?.off?.('open', () => setChatActive(true)),
        () =>
          window.MessengerWidget?.off?.('close', () => setChatActive(false)),
        () =>
          window.MessengerWidget?.off?.('error', () => setChatActive(false)),
      );
    }
    return () => subs.forEach((unsub) => unsub());
  }, [setChatActive]);

  // Eligibility check
  useEffect(() => {
    const fetchEligibility = async () => {
      const requestId = Date.now().toString(); // Simple correlation ID
      logger.info('[ChatSession] Checking chat eligibility', {
        requestId,
        memberId: options?.memberId,
        planId: options?.planId,
      });

      try {
        setLoading(true);
        // SERVER-SIDE CALL: Use fetch to backend API route
        logger.info('[ChatSession] Sending request to chat API', {
          requestId,
          url: `/api/chat/getChatInfo`,
          params: { memberId: options?.memberId, planId: options?.planId },
        });

        const response = await fetch(
          `/api/chat/getChatInfo?memberId=${options?.memberId}&memberType=byMemberCk&planId=${options?.planId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-correlation-id': requestId,
            },
          },
        );

        if (!response.ok) {
          logger.error('[ChatSession] API request failed', {
            requestId,
            status: response.status,
            statusText: response.statusText,
          });
          throw new Error('Failed to fetch chat eligibility');
        }

        const data = await response.json();
        logger.info('[ChatSession] Chat eligibility response received', {
          requestId,
          isEligible: data.isEligible,
          cloudChatEligible: data.cloudChatEligible,
          businessHoursAvailable: !!data.businessHours?.text,
        });

        const isAvailable = data.businessHours?.text
          ? isWithinBusinessHours(data.businessHours.text)
          : true;
        setEligibility({ ...data, isEligible: data.isEligible && isAvailable });

        logger.info('[ChatSession] Initializing chat service', {
          requestId,
          cloudChatEligible: data.cloudChatEligible,
        });
        // Initialize chatService with cloudChatEligible
        await chatService.initialize(data.cloudChatEligible);
        logger.info('[ChatSession] Chat service initialized successfully', {
          requestId,
        });
      } catch (err) {
        logger.error('[ChatSession] Error fetching chat eligibility', {
          requestId,
          error: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
        });

        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch chat eligibility'),
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
  ]);

  // Chat actions
  const openChat = useCallback(() => {
    logger.info('[ChatSession] Attempting to open chat', {
      memberId: options?.memberId,
      planId: options?.planId,
      isEligible: eligibility?.isEligible,
    });

    if (!eligibility?.isEligible) {
      logger.warn('[ChatSession] Cannot open chat - not eligible', {
        memberId: options?.memberId,
        planId: options?.planId,
      });
      setError(new Error('Chat is not available'));
      return;
    }
    setOpen(true);
    logger.info('[ChatSession] Chat opened successfully');
  }, [eligibility, setOpen, setError, options?.memberId, options?.planId]);

  const closeChat = useCallback(() => {
    logger.info('[ChatSession] Closing chat', {
      memberId: options?.memberId,
      planId: options?.planId,
    });
    setOpen(false);
  }, [setOpen, options?.memberId, options?.planId]);

  const minimizeChat = useCallback(() => {
    logger.info('[ChatSession] Minimizing chat');
    setMinimized(true);
  }, [setMinimized]);

  const maximizeChat = useCallback(() => {
    logger.info('[ChatSession] Maximizing chat');
    setMinimized(false);
  }, [setMinimized]);

  const startChat = useCallback(async () => {
    const requestId = Date.now().toString();
    logger.info('[ChatSession] Starting chat session', {
      requestId,
      memberId: options?.memberId,
      planId: options?.planId,
      isEligible: eligibility?.isEligible,
    });

    try {
      if (!eligibility?.isEligible) {
        logger.warn('[ChatSession] Cannot start chat - not eligible', {
          requestId,
        });
        throw new Error('Chat not available');
      }
      setLoading(true);
      // Construct payload from store or options as needed
      const payload = { ...options?.payload };
      logger.info('[ChatSession] Calling chat service startChat', {
        requestId,
        payload,
      });
      await chatService.startChat(payload);
      setChatActive(true);
      options?.onLockPlanSwitcher?.(true);
      logger.info('[ChatSession] Chat session started successfully', {
        requestId,
      });
    } catch (err) {
      logger.error('[ChatSession] Error starting chat', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(err instanceof Error ? err : new Error('Failed to start chat'));
    } finally {
      setLoading(false);
    }
  }, [eligibility, setLoading, setError, chatService, setChatActive, options]);

  const endChat = useCallback(async () => {
    const requestId = Date.now().toString();
    logger.info('[ChatSession] Ending chat session', { requestId });
    try {
      setLoading(true);
      logger.info('[ChatSession] Calling chat service endChat', { requestId });
      await chatService.endChat();
      setChatActive(false);
      options?.onLockPlanSwitcher?.(false);
      logger.info('[ChatSession] Chat session ended successfully', {
        requestId,
      });
    } catch (err) {
      logger.error('[ChatSession] Error ending chat', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(err instanceof Error ? err : new Error('Failed to end chat'));
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, chatService, setChatActive, options]);

  const sendMessage = useCallback(
    async (text: string) => {
      const requestId = Date.now().toString();
      logger.info('[ChatSession] Sending chat message', {
        requestId,
        messageLength: text.length,
        isChatActive,
      });

      try {
        if (!isChatActive) {
          logger.warn(
            '[ChatSession] Cannot send message - no active chat session',
            { requestId },
          );
          throw new Error('No active chat session');
        }
        await chatService.sendMessage(text);
        logger.info('[ChatSession] Message sent successfully', { requestId });
      } catch (err) {
        logger.error('[ChatSession] Error sending message', {
          requestId,
          error: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
        });
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
