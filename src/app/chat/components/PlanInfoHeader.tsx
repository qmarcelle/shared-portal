interface PlanInfoHeaderProps {
  planName: string;
  isActive: boolean;
  onSwitchPlan?: () => void;
}

export function PlanInfoHeader({
  planName,
  isActive,
  onSwitchPlan,
}: PlanInfoHeaderProps) {
  return (
    <div
      className="plan-info-header"
      role="banner"
      aria-label="Current plan information"
    >
      <div className="plan-info-content">
        <span className="plan-name">Chatting about: {planName}</span>
        {onSwitchPlan && !isActive && (
          <button
            onClick={onSwitchPlan}
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
