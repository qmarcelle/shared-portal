'use client';

interface Plan {
  id: string;
  name: string;
}

interface PlanInfoExtensionProps {
  currentPlan: Plan | null;
  availablePlans: Plan[];
  onPlanSwitch: (planId: string) => void;
}

export const PlanInfoExtension = ({
  currentPlan,
  availablePlans,
  onPlanSwitch,
}: PlanInfoExtensionProps) => {
  if (!currentPlan || availablePlans.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Current Plan:</span>
        <span className="text-blue-600">{currentPlan.name}</span>
      </div>
      {availablePlans.length > 1 && (
        <div className="mt-2">
          <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-1">
            Switch Plan:
          </label>
          <select
            id="plan-select"
            value={currentPlan.id}
            onChange={(e) => onPlanSwitch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availablePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}; 