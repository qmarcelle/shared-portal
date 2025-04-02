import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import { mockUserEligibility } from '../../../mocks/chatData';
import { ClientType, PlanInfo } from '../../../models/chat';
import * as chatHoursUtils from '../../../utils/chatHours';

// Mock the chat hours util to control business hours
jest.mock('../../../utils/chatHours', () => ({
  checkChatHours: jest.fn(),
  formatLegacyChatHours: jest
    .fn()
    .mockReturnValue('Monday-Friday: 8:00 AM - 6:00 PM'),
  parseLegacyChatHours: jest.fn(),
  isWithinBusinessHours: jest.fn(),
}));

// Mock chat API
jest.mock('../../../utils/chatAPI', () => ({
  startChatSession: jest.fn().mockResolvedValue({
    sessionId: 'test-session-id',
    startTime: new Date().toISOString(),
    isActive: true,
  }),
  sendChatMessage: jest.fn().mockResolvedValue({
    id: 'test-message-id',
    text: 'Test response',
    sender: 'agent',
    timestamp: Date.now(),
  }),
  endChatSession: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock GenesysChatService
jest.mock('../../../utils/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Mock CobrowseService
jest.mock('../../../utils/CobrowseService', () => {
  return {
    CobrowseService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      createSession: jest.fn().mockResolvedValue('test-code'),
      endSession: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Add mock for useChatStore before running tests
jest.mock('../../../utils/chatStore', () => {
  // Define mock functions within the mock declaration to avoid reference errors
  const mockReset = jest.fn();
  const mockSetOpen = jest.fn();
  const mockLockPlanSwitcher = jest.fn();
  const mockUnlockPlanSwitcher = jest.fn();
  const mockSetHasMultiplePlans = jest.fn();
  const mockAddMessage = jest.fn();

  // Create a mock store with getState functionality
  const store = {
    isOpen: false,
    setOpen: mockSetOpen,
    messages: [],
    isPlanSwitcherLocked: false,
    lockPlanSwitcher: mockLockPlanSwitcher,
    unlockPlanSwitcher: mockUnlockPlanSwitcher,
    session: null,
    setSession: jest.fn(),
    hasMultiplePlans: false,
    setHasMultiplePlans: mockSetHasMultiplePlans,
    addMessage: mockAddMessage,
    reset: mockReset,
    getState: function () {
      return this;
    },
  };

  // Return the actual implementation with the store
  return {
    useChatStore: jest.fn().mockImplementation(() => store),
  };
});

/**
 * User Story 31156: Business Hours Handling
 *
 * - System must display out-of-hours notification based on the selected plan's business hours
 * - Business hours are determined by the plan the member is viewing
 * - When switching to a plan outside business hours, an out-of-hours notification must display
 */
describe('US31156: Business Hours Handling', () => {
  // Mock plan switcher component
  const PlanSwitcher = ({
    onPlanChange,
  }: {
    onPlanChange: (plan: PlanInfo) => void;
  }) => (
    <select
      data-testid="plan-switcher"
      onChange={(e) => {
        const plan =
          e.target.value === 'in-hours' ? inHoursPlan : outOfHoursPlan;
        onPlanChange(plan);
      }}
    >
      <option value="in-hours">In Hours Plan</option>
      <option value="out-of-hours">Out of Hours Plan</option>
    </select>
  );

  // Mock plans
  const inHoursPlan: PlanInfo = {
    planId: 'PLAN-IN-HOURS',
    planName: 'In Hours Plan',
    lineOfBusiness: ClientType.Default,
    isEligibleForChat: true,
    businessHours: 'S_S_24', // 24/7 availability
  } as PlanInfo;

  const outOfHoursPlan: PlanInfo = {
    planId: 'PLAN-OUT-HOURS',
    planName: 'Out of Hours Plan',
    lineOfBusiness: ClientType.Default,
    isEligibleForChat: true,
    businessHours: 'M_F_8_6', // Monday-Friday 8am-6pm
  } as PlanInfo;

  // Default props
  const defaultProps = {
    userEligibility: mockUserEligibility,
    config: {
      token: 'test-token',
      endPoint: 'https://api.example.com/chat',
      opsPhone: '1-800-123-4567',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'MEMBER123',
      groupId: 'GROUP456',
      planId: 'PLAN789',
      planName: 'Premium Health Plan',
      businessHours: {
        isOpen24x7: true,
        days: [],
      },
    },
    currentPlan: inHoursPlan,
    availablePlans: [inHoursPlan, outOfHoursPlan],
    isPlanSwitcherOpen: false,
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display chat when within business hours', async () => {
    // Mock chat hours check to return true (within hours)
    jest.spyOn(chatHoursUtils, 'checkChatHours').mockReturnValue(true);

    render(<ChatWidget {...defaultProps} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Verify that the chat form is displayed (not unavailable message)
    expect(screen.getByLabelText(/service.*help/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/chat is currently unavailable/i),
    ).not.toBeInTheDocument();
  });

  it('should display out-of-hours notification when outside business hours', async () => {
    // Mock chat hours check to return false (outside hours)
    jest.spyOn(chatHoursUtils, 'checkChatHours').mockReturnValue(false);

    render(<ChatWidget {...defaultProps} currentPlan={outOfHoursPlan} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Verify that the unavailable message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/chat is currently unavailable/i),
      ).toBeInTheDocument();
    });

    // Verify business hours are displayed
    expect(
      screen.getByText(/monday-friday: 8:00 am - 6:00 pm/i, { exact: false }),
    ).toBeInTheDocument();
  });

  it('should update business hours notification when switching plans', async () => {
    // Set up with dynamic plan switching
    const TestComponent = () => {
      const [currentPlan, setCurrentPlan] =
        React.useState<PlanInfo>(inHoursPlan);

      // Simulate business hours based on selected plan
      React.useEffect(() => {
        if (currentPlan.planId === inHoursPlan.planId) {
          // In-hours plan
          jest.spyOn(chatHoursUtils, 'checkChatHours').mockReturnValue(true);
        } else {
          // Out-of-hours plan
          jest.spyOn(chatHoursUtils, 'checkChatHours').mockReturnValue(false);
        }
      }, [currentPlan]);

      return (
        <>
          <PlanSwitcher onPlanChange={setCurrentPlan} />
          <ChatWidget {...defaultProps} currentPlan={currentPlan} />
        </>
      );
    };

    render(<TestComponent />);

    // Initial plan is in-hours
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Should show chat form (not unavailable message)
    expect(screen.getByLabelText(/service.*help/i)).toBeInTheDocument();

    // Close chat to switch plans
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Switch to out-of-hours plan
    const planSwitcher = screen.getByTestId('plan-switcher');
    await userEvent.selectOptions(planSwitcher, 'out-of-hours');

    // Reopen chat
    await userEvent.click(chatButton);

    // Should now show unavailable message
    await waitFor(() => {
      expect(
        screen.getByText(/chat is currently unavailable/i),
      ).toBeInTheDocument();
    });
  });

  it('should prevent starting chat when outside business hours', async () => {
    // Mock chat hours check to return false (outside hours)
    jest.spyOn(chatHoursUtils, 'checkChatHours').mockReturnValue(false);

    render(<ChatWidget {...defaultProps} currentPlan={outOfHoursPlan} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Verify unavailable screen is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/chat is currently unavailable/i),
      ).toBeInTheDocument();
    });

    // Verify form is not displayed
    expect(screen.queryByLabelText(/service.*help/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /start chat/i }),
    ).not.toBeInTheDocument();
  });
});
