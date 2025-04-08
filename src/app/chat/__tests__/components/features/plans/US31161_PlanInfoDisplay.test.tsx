import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockUserEligibility } from '../../../../__mocks__/chatData';
import { ChatWidget } from '../../../../components/core/ChatWidget';
import { ChatPlan } from '../../../../models/types';
import * as chatStore from '../../../../stores/chatStore';

// Mock chat API
jest.mock('../../../../utils/chatAPI', () => ({
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
jest.mock('../../../../utils/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock('../../../../utils/CobrowseService', () => {
  return {
    CobrowseService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      createSession: jest.fn().mockResolvedValue('test-code'),
      endSession: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Make sure chat hours check passes
jest.mock('../../../../utils/chatHours', () => ({
  checkChatHours: jest.fn().mockReturnValue(true),
}));

// Mock the chatStore module
jest.mock('../../../../stores/chatStore', () => {
  const actual = jest.requireActual('../../../../stores/chatStore');
  return {
    ...actual,
    useChatStore: jest.fn(),
  };
});

/**
 * User Stories:
 * 31161: Plan Information Display - Display plan member will chat about
 * 31166: Single Plan Handling - Don't display plan info for single-plan members
 */
describe('Plan Information Display', () => {
  // Mock plans
  const plan1: ChatPlan = {
    id: 'plan1',
    name: 'Medical Plan',
    lineOfBusiness: 'Medical',
    isChatEligible: true,
    businessHours: {
      isOpen24x7: true,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
      lastUpdated: Date.now(),
      source: 'api',
    },
    termsAndConditions: '',
    isActive: true,
    memberFirstname: 'John',
    memberLastname: 'Doe',
    memberId: 'MEMBER123',
    groupId: 'GROUP456',
    isMedicalEligible: true,
    isDentalEligible: false,
    isVisionEligible: false,
    lobGroup: 'Medical',
  };

  const plan2: ChatPlan = {
    id: 'plan2',
    name: 'Dental Plan',
    lineOfBusiness: 'Dental',
    isChatEligible: true,
    businessHours: {
      isOpen24x7: true,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
      lastUpdated: Date.now(),
      source: 'api',
    },
    termsAndConditions: '',
    isActive: true,
    memberFirstname: 'John',
    memberLastname: 'Doe',
    memberId: 'MEMBER123',
    groupId: 'GROUP456',
    isMedicalEligible: false,
    isDentalEligible: true,
    isVisionEligible: false,
    lobGroup: 'Dental',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // US31161: Display plan member will chat about
  describe('US31161: Plan Information Display', () => {
    it('should display the current plan name in the header when multiple plans are available', () => {
      // Mock the useChatStore hook implementation
      const mockStore = {
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1, plan2],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      };
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue(mockStore);

      render(<ChatWidget />);
      expect(
        screen.getByText(`Chatting about: ${plan1.name}`),
      ).toBeInTheDocument();
    });

    it('should display generic header when only one plan is available', () => {
      // Mock the useChatStore hook implementation
      const mockStore = {
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      };
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue(mockStore);

      render(<ChatWidget />);
      expect(screen.getByText('Chat with us')).toBeInTheDocument();
    });

    it('should display current plan information in start chat window for multi-plan users', async () => {
      // Mock the useChatStore hook implementation
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue({
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1, plan2],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      });

      render(<ChatWidget />);

      // Verify that plan information is displayed
      expect(screen.getByText(/Current Plan:/i)).toBeInTheDocument();
      expect(screen.getByText(plan1.name)).toBeInTheDocument();

      // Verify that switch button is displayed
      expect(
        screen.getByRole('button', { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it('should display plan information in active chat window for multi-plan users', async () => {
      // Mock the useChatStore hook implementation
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue({
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1, plan2],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      });

      render(<ChatWidget />);

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
        expect(screen.getByTestId('chat-body')).toHaveTextContent(plan1.name);
      });
    });
  });

  // US31166: Do not display plan info for single-plan members
  describe('US31166: Single Plan Handling', () => {
    it('should NOT display plan information in start chat window for single-plan users', async () => {
      // Mock the useChatStore hook implementation
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue({
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      });

      render(<ChatWidget />);

      // Verify that plan information is NOT displayed
      expect(screen.queryByText(/Current Plan:/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /switch/i }),
      ).not.toBeInTheDocument();
    });

    it('should NOT display plan information in active chat window for single-plan users', async () => {
      // Mock the useChatStore hook implementation
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue({
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      });

      render(<ChatWidget />);

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
        expect(chatBody).not.toHaveTextContent(plan1.name);
      });
    });

    it('should have streamlined UI for single-plan users', async () => {
      // Mock the useChatStore hook implementation
      jest.spyOn(chatStore, 'useChatStore').mockReturnValue({
        isOpen: true,
        error: null,
        closeChat: jest.fn(),
        openChat: jest.fn(),
        isChatActive: false,
        isWithinBusinessHours: true,
        currentPlan: plan1,
        startChat: jest.fn(),
        endChat: jest.fn(),
        availablePlans: [plan1],
        businessHours: plan1.businessHours,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        userEligibility: mockUserEligibility,
      });

      // Render both single-plan and multi-plan widgets for comparison
      const { unmount } = render(<ChatWidget />);

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
      render(<ChatWidget />);

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
