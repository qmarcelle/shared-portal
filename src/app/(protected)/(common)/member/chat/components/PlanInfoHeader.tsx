import { switchUser } from '@/userManagement/actions/switchUser';
import { usePlanStore } from '@/userManagement/stores/planStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';

export interface PlanInfoHeaderProps {
  planName: string;
  isActive: boolean;
  onOpenPlanSwitcher: () => void;
}

export function PlanInfoHeader({ planName, isActive }: PlanInfoHeaderProps) {
  const router = useRouter();
  const { setError } = usePlanStore();
  const { closeAndRedirect } = useChatStore();

  const handlePlanSwitch = useCallback(async () => {
    try {
      // Close chat window and reset state
      closeAndRedirect();

      // Switch to the new plan
      await switchUser(undefined, undefined);

      // Redirect to dashboard for plan selection
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to switch plans. Please try again.');
      console.error('Plan switch error:', error);
    }
  }, [router, setError, closeAndRedirect]);

  return (
    <div
      className="plan-info-header"
      role="banner"
      aria-label="Current plan information"
    >
      <div className="plan-info-content">
        <span className="plan-name">Chatting about: {planName}</span>
        {!isActive && (
          <button
            onClick={handlePlanSwitch}
            className="switch-plan-button"
            aria-label="Switch to a different plan"
          >
            Switch Plan
          </button>
        )}
      </div>
      {isActive && (
        <div className="plan-lock-notice" role="alert">
          Chat session in progress. Please end your chat before switching plans.
        </div>
      )}
    </div>
  );
}
