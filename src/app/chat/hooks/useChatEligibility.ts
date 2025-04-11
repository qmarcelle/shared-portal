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
export function useChatEligibility(memberId: string, planId: string) {
  const [eligibility, setEligibility] = useState<ChatEligibility | null>(null);
  const [loading, setLoading] = useState(true);

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
        setEligibility({
          chatAvailable: data.chatAvailable,
          cloudChatEligible: data.cloudChatEligible,
          chatGroup: data.chatGroup,
          workingHours: data.workingHours,
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

  return { eligibility, loading };
}
