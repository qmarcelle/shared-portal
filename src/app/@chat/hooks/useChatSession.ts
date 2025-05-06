import { memberService } from '@/utils/api/memberService';
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
      try {
        setLoading(true);
        const response = await memberService.get(
          `/api/member/v1/members/byMemberCk/${options?.memberId}/chat/getChatInfo`,
          { params: { planId: options?.planId } },
        );
        if (!response || response.status !== 200) {
          throw new Error('Failed to fetch chat eligibility');
        }
        const data = response.data;
        const isAvailable = data.businessHours?.text
          ? isWithinBusinessHours(data.businessHours.text)
          : true;
        setEligibility({ ...data, isEligible: data.isEligible && isAvailable });
      } catch (err) {
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
  ]);

  // Chat actions
  const openChat = useCallback(() => {
    if (!eligibility?.isEligible) {
      setError(new Error('Chat is not available'));
      return;
    }
    setOpen(true);
  }, [eligibility, setOpen, setError]);

  const closeChat = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const minimizeChat = useCallback(() => {
    setMinimized(true);
  }, [setMinimized]);

  const maximizeChat = useCallback(() => {
    setMinimized(false);
  }, [setMinimized]);

  const startChat = useCallback(async () => {
    try {
      if (!eligibility?.isEligible) {
        throw new Error('Chat not available');
      }
      setLoading(true);
      // Construct payload from store or options as needed
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
      try {
        if (!isChatActive) {
          throw new Error('No active chat session');
        }
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
