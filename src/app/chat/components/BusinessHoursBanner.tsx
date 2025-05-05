'use client';
import { AlertBar } from '@/components/foundation/AlertBar';
import { useChatStore } from '../stores/chatStore';

/**
 * Out-of-hours notification
 */
export default function BusinessHoursBanner() {
  const { isOOO, businessHoursText } = useChatStore();
  if (!isOOO) return null;

  const message = `Our chat is closed (${businessHoursText}). Please try again during business hours.`;

  return (
    <AlertBar
      alerts={[message]}
      role="alert"
      aria-label="Business hours notification"
    />
  );
}
