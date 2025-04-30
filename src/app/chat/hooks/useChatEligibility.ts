import type { ChatEligibility, ChatInfoResponse } from '@/app/chat/types/index';
import { ChatError } from '@/app/chat/types/index';
import { useEffect, useState } from 'react';

/**
 * Hook to check chat eligibility for a member and plan.
 * Fetches eligibility status and manages loading state.
 *
 * @param memberId - Unique identifier for the member
 * @param planId - Current plan identifier
 * @returns Object containing eligibility status and loading state
 *
 * @example
 * ```tsx
 * function ChatComponent({ memberId, planId }) {
 *   const { eligibility, loading } = useChatEligibility(memberId, planId);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (!eligibility?.chatAvailable) return null;
 *
 *   return <ChatWidget />;
 * }
 * ```
 */

export interface ChatEligibilityReturn {
  eligibility: ChatEligibility | null;
  loading: boolean;
  isInitialized: boolean;
  isOpen: boolean;
  isChatActive: boolean;
  error: Error | null;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  startChat: () => void;
  endChat: () => void;
}

export function useChatEligibility(
  memberId: string,
  planId: string,
): ChatEligibilityReturn {
  const [eligibility, setEligibility] = useState<ChatEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Parse business hours string into a structured format
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

  // Check if current time is within business hours
  const isWithinBusinessHours = (businessHours: string): boolean => {
    const { days, startHour, endHour, isValid } =
      parseBusinessHours(businessHours);
    if (!isValid) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Check if current day is within business days
    const isBusinessDay = days.includes(
      ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][currentDay],
    );

    return isBusinessDay && currentHour >= startHour && currentHour < endHour;
  };

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const minimizeChat = () => window.Genesys?.('command', 'Messenger.minimize');
  const maximizeChat = () => window.Genesys?.('command', 'Messenger.maximize');
  const startChat = () => {
    setIsChatActive(true);
    setIsInitialized(true);
  };
  const endChat = () => setIsChatActive(false);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const response = await fetch(
          `/api/chat/eligibility?memberId=${memberId}&planId=${planId}`,
        );
        if (!response.ok) {
          throw new ChatError(
            'Failed to fetch chat eligibility',
            'ELIGIBILITY_ERROR',
          );
        }
        const data: ChatInfoResponse = await response.json();

        // Enhance eligibility with business hours check
        const isAvailable = data.businessHours?.text
          ? isWithinBusinessHours(data.businessHours.text)
          : true;

        setEligibility({
          chatAvailable: data.chatAvailable && isAvailable,
          cloudChatEligible: data.cloudChatEligible,
          chatGroup: data.chatGroup,
          workingHours: data.workingHours,
          businessHours: {
            text: data.businessHours?.text || '',
            isOpen: isAvailable,
          },
        });
      } catch (error) {
        console.error('Error fetching chat eligibility:', error);
        setEligibility(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [memberId, planId]);

  return {
    eligibility,
    loading,
    isInitialized,
    isOpen,
    isChatActive,
    error,
    isLoading: loading,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    startChat,
    endChat,
  };
}
