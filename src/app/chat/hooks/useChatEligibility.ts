import { useEffect, useState } from 'react';
import type { ChatInfoResponse } from '../types';

export type ChatEligibility = ChatInfoResponse & {
  maxWaitTime?: number;
  estimatedWaitTime?: number;
  queueLength?: number;
  agentsAvailable?: number;
};

export function useChatEligibility(memberId: string, planId: string) {
  const [eligibility, setEligibility] = useState<ChatEligibility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        // TODO: Replace with actual API call to your eligibility service
        const response = await fetch(
          `/api/chat/eligibility?memberId=${memberId}&planId=${planId}`,
        );
        const data = await response.json();

        setEligibility({
          chatGroup: data.chatGroup ?? 'default',
          chatAvailable: data.chatAvailable ?? true,
          cloudChatEligible: data.cloudChatEligible ?? false,
          workingHours: data.workingHours ?? '9:00 AM - 5:00 PM EST',
          maxWaitTime: data.maxWaitTime,
          estimatedWaitTime: data.estimatedWaitTime,
          queueLength: data.queueLength,
          agentsAvailable: data.agentsAvailable,
        });
      } catch (error) {
        console.error('Failed to check chat eligibility:', error);
        // Set default values if eligibility check fails
        setEligibility({
          chatGroup: 'default',
          chatAvailable: true,
          cloudChatEligible: false,
          workingHours: '9:00 AM - 5:00 PM EST',
        });
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [memberId, planId]);

  return { eligibility, loading };
}
