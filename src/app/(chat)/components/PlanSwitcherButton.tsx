'use client';
import { useChatStore } from '@/app/(chat)/stores/chatStore';
import { Button } from '@/components/foundation/Button';
import { usePlanStore } from '../../../userManagement/stores/planStore';

/**
 * "Switch Plan" inside pre-chat window
 */
export default function PlanSwitcherButton() {
  const { endChat } = useChatStore();
  const { plans, selectedPlanId, openPlanSwitcher } = usePlanStore();

  if (plans.length <= 1) return null;

  const handleSwitch = () => {
    endChat();
    openPlanSwitcher();
  };

  return (
    <Button
      label="Switch Plan"
      callback={handleSwitch}
      className="plan-switch-button"
      type="secondary"
    />
  );
}
