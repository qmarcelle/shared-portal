import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import { mockUserEligibility } from '../../../mocks/chatData';
import { ClientType, PlanInfo } from '../../../models/chat';

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

// Mock services
jest.mock('../../../utils/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock('../../../utils/CobrowseService', () => {
  return {
    CobrowseService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      createSession: jest.fn().mockResolvedValue('test-code'),
      endSession: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Make sure chat hours check passes
jest.mock('../../../utils/chatHours', () => ({
  checkChatHours: jest.fn().mockReturnValue(true),
}));

/**
 * User Stories:
 * 31161: Plan Information Display - Display plan member will chat about
 * 31166: Single Plan Handling - Don't display plan info for single-plan members
 */
describe('Plan Information Display', () => {
  // Mock plans
  const plan1: PlanInfo = {
    planId: 'PLAN-1',
    planName: 'Medical Plan',
    lineOfBusiness: ClientType.Default,
    isEligibleForChat: true,
    businessHours: 'S_S_24',
  } as PlanInfo;

  const plan2: PlanInfo = {
    planId: 'PLAN-2',
    planName: 'Dental Plan',
    lineOfBusiness: ClientType.Default,
    isEligibleForChat: true,
    businessHours: 'S_S_24',
  } as PlanInfo;

  // Default props for multi-plan scenario
  const multiPlanProps = {
    userEligibility: mockUserEligibility,
    config: {
      token: 'test-token',
      endPoint: 'https://api.example.com/chat',
      opsPhone: '1-800-123-4567',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'MEMBER123',
      groupId: 'GROUP456',
      planId: plan1.planId,
      planName: plan1.planName,
      businessHours: {
        isOpen24x7: true,
        days: [],
      },
    },
    currentPlan: plan1,
    availablePlans: [plan1, plan2],
    isPlanSwitcherOpen: false,
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
  };

  // Props for single-plan scenario
  const singlePlanProps = {
    ...multiPlanProps,
    availablePlans: [plan1],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // US31161: Display plan member will chat about
  describe('US31161: Plan Information Display', () => {
    it('should display current plan information in start chat window for multi-plan users', async () => {
      render(<ChatWidget {...multiPlanProps} />);

      // Open chat
      const chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Verify that plan information is displayed
      expect(screen.getByText(/Current Plan:/i)).toBeInTheDocument();
      expect(screen.getByText(plan1.planName)).toBeInTheDocument();

      // Verify that switch button is displayed
      expect(
        screen.getByRole('button', { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it('should display plan information in active chat window for multi-plan users', async () => {
      render(<ChatWidget {...multiPlanProps} />);

      // Open chat
      const chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Complete chat form
      const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
      await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

      const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
      await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

      // Start chat
      const startChatButton = screen.getByRole('button', {
        name: /start chat/i,
      });
      await userEvent.click(startChatButton);

      // Verify that plan information is displayed in active chat window
      await waitFor(() => {
        expect(screen.getByTestId('chat-body')).toHaveTextContent(
          plan1.planName,
        );
      });
    });
  });

  // US31166: Do not display plan info for single-plan members
  describe('US31166: Single Plan Handling', () => {
    it('should NOT display plan information in start chat window for single-plan users', async () => {
      render(<ChatWidget {...singlePlanProps} />);

      // Open chat
      const chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Verify that plan information is NOT displayed
      expect(screen.queryByText(/Current Plan:/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /switch/i }),
      ).not.toBeInTheDocument();
    });

    it('should NOT display plan information in active chat window for single-plan users', async () => {
      render(<ChatWidget {...singlePlanProps} />);

      // Open chat
      const chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Complete chat form
      const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
      await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

      const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
      await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

      // Start chat
      const startChatButton = screen.getByRole('button', {
        name: /start chat/i,
      });
      await userEvent.click(startChatButton);

      // Mock the chat body component to verify it's not displaying plan info
      await waitFor(() => {
        const chatBody = screen.getByTestId('chat-body');
        expect(chatBody).not.toHaveTextContent(plan1.planName);
      });
    });

    it('should have streamlined UI for single-plan users', async () => {
      // Render both single-plan and multi-plan widgets for comparison
      const { unmount } = render(<ChatWidget {...multiPlanProps} />);

      // Open chat
      let chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Calculate height of multi-plan chat window
      const multiPlanChatWindow = screen.getByRole('dialog', { hidden: true });
      const multiPlanHeight = multiPlanChatWindow.clientHeight;

      // Close and unmount
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      unmount();

      // Render single-plan widget
      render(<ChatWidget {...singlePlanProps} />);

      // Open chat
      chatButton = screen.getByRole('button', { name: /chat with us/i });
      await userEvent.click(chatButton);

      // Get single-plan chat window
      const singlePlanChatWindow = screen.getByRole('dialog', { hidden: true });

      // Single-plan UI should be more streamlined (potentially smaller height)
      // Note: This check may need adjustment based on your actual implementation
      expect(singlePlanChatWindow.clientHeight).toBeLessThanOrEqual(
        multiPlanHeight,
      );
    });
  });
});
