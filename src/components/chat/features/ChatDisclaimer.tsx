import React from 'react';
import { ClientType, PlanInfo } from '../../../models/chat';

interface ChatDisclaimerProps {
  currentPlan: PlanInfo | null;
}

/**
 * Component that displays legal disclaimers based on plan type
 */
const ChatDisclaimer: React.FC<ChatDisclaimerProps> = ({ currentPlan }) => {
  // Get client type from current plan
  const clientType =
    (currentPlan?.lineOfBusiness as ClientType) || ClientType.Default;

  // Get disclaimer text based on client type
  const getDisclaimerText = (): string => {
    switch (clientType) {
      case ClientType.BlueCare:
      case ClientType.BlueCarePlus:
        return "For quality assurance your chat may be monitored and/or recorded. Benefits are based on the member's eligibility when services are rendered. Benefits are determined by the Division of TennCare and are subject to change.";

      case ClientType.CoverTN:
        return 'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim.';

      // Default for all other plans
      default:
        return 'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim. For quality assurance your chat may be monitored and/or recorded.';
    }
  };

  return (
    <div className="bg-secondary-light p-3 text-xs text-secondary border-t border-tertiary-4">
      {getDisclaimerText()}
    </div>
  );
};

export default ChatDisclaimer;
