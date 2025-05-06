import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '@/components/core/ChatWidget';
import { ClientType } from '../../../models/plans';
import * as chatHoursUtils from '../../../services/utils/chatHours';
import { useChatStore } from '../../../stores/chatStore';

// Mock the chat hours util to control business hours
jest.mock('../../../services/utils/chatHours', () => ({
  checkChatHours: jest.fn(),
  formatLegacyChatHours: jest
    .fn()
    .mockReturnValue('Monday-Friday: 8:00 AM - 6:00 PM'),
  parseLegacyChatHours: jest.fn(),
  isWithinBusinessHours: jest.fn(),
}));

// Mock chat API
jest.mock('../../../services/chatAPI', () => ({
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
jest.mock('../../../services/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Mock CobrowseService
jest.mock('../../../services/CobrowseService', () => {
  return {
    CobrowseService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      createSession: jest.fn().mockResolvedValue('test-code'),
      endSession: jest.fn().mockResolvedValue({}),
    })),
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
  // Mock plans
  const inHoursPlan = {
    id: 'PLAN-IN-HOURS',
    name: 'In Hours Plan',
    lineOfBusiness: ClientType.Default,
    isChatEligible: true,
    businessHours: {
      isOpen24x7: true,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
      lastUpdated: Date.now(),
      source: 'api' as const,
    },
    termsAndConditions: '',
    isActive: true,
  };

  const outOfHoursPlan = {
    id: 'PLAN-OUT-HOURS',
    name: 'Out of Hours Plan',
    lineOfBusiness: ClientType.Default,
    isChatEligible: true,
    businessHours: {
      isOpen24x7: false,
      days: [
        {
          day: 'Monday',
          openTime: '08:00',
          closeTime: '18:00',
          isOpen: true,
        },
        {
          day: 'Tuesday',
          openTime: '08:00',
          closeTime: '18:00',
          isOpen: true,
        },
        {
          day: 'Wednesday',
          openTime: '08:00',
          closeTime: '18:00',
          isOpen: true,
        },
        {
          day: 'Thursday',
          openTime: '08:00',
          closeTime: '18:00',
          isOpen: true,
        },
        {
          day: 'Friday',
          openTime: '08:00',
          closeTime: '18:00',
          isOpen: true,
        },
      ],
      timezone: 'America/New_York',
      isCurrentlyOpen: false,
      lastUpdated: Date.now(),
      source: 'api' as const,
    },
    termsAndConditions: '',
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chat store state and initialize with test data
    const store = useChatStore.getState();
    store.reset();
  });

  it('should display chat when within business hours', async () => {
    // Set up store with in-hours plan
    const store = useChatStore.getState();
    store.setCurrentPlan(inHoursPlan);
    store.setAvailablePlans([inHoursPlan, outOfHoursPlan]);

    // Mock chat hours check to return true (within hours)
    jest.spyOn(chatHoursUtils, 'isWithinBusinessHours').mockReturnValue(true);

    render(<ChatWidget />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Verify that the chat form is displayed (not unavailable message)
    expect(
      screen.getByRole('button', { name: /start chat/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/chat is currently unavailable/i),
    ).not.toBeInTheDocument();
  });

  it('should display out-of-hours notification when outside business hours', async () => {
    // Set up store with out-of-hours plan
    const store = useChatStore.getState();
    store.setCurrentPlan(outOfHoursPlan);
    store.setAvailablePlans([inHoursPlan, outOfHoursPlan]);

    // Mock chat hours check to return false (outside hours)
    jest.spyOn(chatHoursUtils, 'isWithinBusinessHours').mockReturnValue(false);

    render(<ChatWidget />);

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
    // Set up store with initial plan
    const store = useChatStore.getState();
    store.setCurrentPlan(inHoursPlan);
    store.setAvailablePlans([inHoursPlan, outOfHoursPlan]);

    // Mock chat hours check to return true initially
    jest.spyOn(chatHoursUtils, 'isWithinBusinessHours').mockReturnValue(true);

    render(<ChatWidget />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Verify chat is available
    expect(
      screen.getByRole('button', { name: /start chat/i }),
    ).toBeInTheDocument();

    // Switch to out-of-hours plan
    store.setCurrentPlan(outOfHoursPlan);

    // Mock chat hours check to return false for new plan
    jest.spyOn(chatHoursUtils, 'isWithinBusinessHours').mockReturnValue(false);

    // Verify that the unavailable message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/chat is currently unavailable/i),
      ).toBeInTheDocument();
    });
  });
});
