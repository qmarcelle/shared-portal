import { ChatConfig, PlanInfo, UserEligibility } from '../models/chat';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeFocusable(): R;
    }
  }

  interface Window {
    CobrowseIO?: {
      license: string;
      customData: {
        user_id: string;
        user_name: string;
      };
      capabilities: string[];
      confirmSession: () => Promise<boolean>;
      confirmRemoteControl: () => Promise<boolean>;
      start: () => Promise<void>;
      stop: () => Promise<void>;
      createSessionCode: () => Promise<string>;
    };
  }
}

export interface TestChatWidgetProps {
  isOpen?: boolean;
  isEligible?: boolean;
  isWithinBusinessHours?: boolean;
  userEligibility?: UserEligibility;
  config?: ChatConfig;
  currentPlan?: PlanInfo;
  availablePlans?: PlanInfo[];
}

export interface MockChatStore {
  isOpen: boolean;
  setOpen: jest.Mock;
  messages: Array<{
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
  }>;
  addMessage: jest.Mock;
  session: {
    sessionId: string;
    startTime: Date;
  } | null;
  startSession: jest.Mock;
  endSession: jest.Mock;
  isPlanSwitcherLocked: boolean;
}
