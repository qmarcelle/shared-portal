import { ToolTip } from '@/components/foundation/Tooltip';
import { useChatStore } from '../stores/chatStore';

interface PlanSwitcherProps {
  onPlanSwitch: (planId: string) => void;
  availablePlans: Array<{ id: string; name: string }>;
  currentPlanId: string;
}

export function PlanSwitcher({
  onPlanSwitch,
  availablePlans,
  currentPlanId,
}: PlanSwitcherProps) {
  const { isPlanSwitcherLocked } = useChatStore();

  return (
    <div className="relative">
      <ToolTip
        showTooltip={isPlanSwitcherLocked}
        label="End your chat session to switch plan information."
        className="tooltip w-full"
      >
        <select
          value={currentPlanId}
          onChange={(e) => onPlanSwitch(e.target.value)}
          disabled={isPlanSwitcherLocked}
          className={`w-full p-2 border rounded ${
            isPlanSwitcherLocked
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          }`}
        >
          {availablePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </ToolTip>
    </div>
  );
}
