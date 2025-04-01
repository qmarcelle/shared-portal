import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import {
  mockAvailablePlans,
  mockChatConfig,
  mockCurrentPlan,
  mockUserEligibility,
} from '../../../mocks/chatData';
import { server } from '../../../mocks/server';
import { PlanInfo, UserEligibility } from '../../../models/chat';
import { useChatStore } from '../../../utils/chatStore';

// Mock the chat store
jest.mock('../../../utils/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('ChatWidget Component', () => {
  // Helper wrapped component for testing
  const TestChatWidget = ({
    isOpen = true,
    isEligible = true,
    isWithinBusinessHours = true,
  }) => {
    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockImplementation(() => ({
      isOpen,
      setOpen: jest.fn(),
      messages: [],
      addMessage: jest.fn(),
      session: null,
      startSession: jest.fn(),
      endSession: jest.fn(),
      isPlanSwitcherLocked: false,
    }));

    // Setup MSW handlers for this test
    server.use(
      http.get('/api/v1/chat/eligibility', () => {
        return HttpResponse.json(
          {
            status: 'success',
            data: {
              ...mockUserEligibility,
              isEligibleForChat: isEligible,
            },
          },
          { status: 200 },
        );
      }),
      http.get('/api/v1/chat/business-hours', () => {
        return HttpResponse.json(
          {
            status: 'success',
            data: {
              isOpen24x7: false,
              isWithinBusinessHours,
              days: mockChatConfig.businessHours.days,
            },
          },
          { status: 200 },
        );
      }),
    );

    // Add missing properties to mock data for type compatibility
    const enhancedUserEligibility: Partial<UserEligibility> = {
      ...mockUserEligibility,
      isChatEligibleMember: isEligible,
      isDemoMember: false,
      isAmplifyMem: false,
      groupId: 'test-group',
      // Add other required properties
    };

    const enhancedCurrentPlan: Partial<PlanInfo> = {
      ...mockCurrentPlan,
      lineOfBusiness: 'test-lob',
      // Add other required properties
    };

    const enhancedAvailablePlans = mockAvailablePlans.map((plan) => ({
      ...plan,
      lineOfBusiness: 'test-lob',
      // Add other required properties
    })) as PlanInfo[];

    return (
      <ChatWidget
        userEligibility={enhancedUserEligibility as UserEligibility}
        config={mockChatConfig}
        currentPlan={enhancedCurrentPlan as PlanInfo}
        availablePlans={enhancedAvailablePlans}
        isPlanSwitcherOpen={false}
        openPlanSwitcher={jest.fn()}
        closePlanSwitcher={jest.fn()}
      />
    );
  };

  it('should render the chat form when eligible and within business hours', async () => {
    render(<TestChatWidget />);

    await waitFor(() => {
      expect(screen.getByText('How can we help you?')).toBeInTheDocument();
    });
  });

  it('should show unavailable screen when outside business hours', async () => {
    render(<TestChatWidget isWithinBusinessHours={false} />);

    await waitFor(() => {
      expect(
        screen.getByText('Chat is currently unavailable'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please try again during our business hours/),
      ).toBeInTheDocument();
    });
  });

  it('should show unavailable screen when not eligible', async () => {
    render(<TestChatWidget isEligible={false} />);

    await waitFor(() => {
      expect(
        screen.getByText('Chat is currently unavailable'),
      ).toBeInTheDocument();
    });
  });

  it('should initialize chat session on form submission', async () => {
    const mockStartSession = jest.fn();
    (useChatStore as unknown as jest.Mock).mockImplementation(() => ({
      isOpen: true,
      setOpen: jest.fn(),
      messages: [],
      addMessage: jest.fn(),
      session: null,
      startSession: mockStartSession,
      endSession: jest.fn(),
      isPlanSwitcherLocked: false,
    }));

    server.use(
      http.post('/api/v1/chat/session', async () => {
        return HttpResponse.json(
          {
            status: 'success',
            data: {
              sessionId: 'test-session-123',
              startTime: new Date().toISOString(),
              isActive: true,
            },
          },
          { status: 200 },
        );
      }),
    );

    render(<TestChatWidget />);

    // Submit the chat form
    const nameInput = screen.getByLabelText('First Name');
    const issueSelect = screen.getByLabelText('What can we help you with?');
    const startButton = screen.getByRole('button', { name: /Start Chat/i });

    await userEvent.type(nameInput, 'John');
    await userEvent.selectOptions(issueSelect, 'Billing Question');
    await userEvent.click(startButton);

    await waitFor(() => {
      expect(mockStartSession).toHaveBeenCalled();
    });
  });

  it('should send and receive chat messages', async () => {
    const mockAddMessage = jest.fn();
    (useChatStore as unknown as jest.Mock).mockImplementation(() => ({
      isOpen: true,
      setOpen: jest.fn(),
      messages: [
        {
          id: 'user-1',
          text: 'Hello',
          sender: 'user',
          timestamp: new Date(),
        },
        {
          id: 'bot-1',
          text: 'Hi there! How can I assist you today?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      addMessage: mockAddMessage,
      session: { sessionId: 'test-session' },
      startSession: jest.fn(),
      endSession: jest.fn(),
      isPlanSwitcherLocked: false,
    }));

    server.use(
      http.post('/api/v1/chat/message', async () => {
        return HttpResponse.json(
          {
            status: 'success',
            data: {
              id: 'bot-response',
              text: 'Thank you for your message. How else can I help?',
              sender: 'bot',
              timestamp: new Date().toISOString(),
            },
          },
          { status: 200 },
        );
      }),
    );

    render(<TestChatWidget />);

    // Check that previous messages are rendered
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(
      screen.getByText('Hi there! How can I assist you today?'),
    ).toBeInTheDocument();

    // Send a new message
    const inputField = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await userEvent.type(inputField, 'I need help with my claim');
    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'I need help with my claim',
          sender: 'user',
        }),
      );
    });
  });

  it('should initialize cobrowse session', async () => {
    (useChatStore as unknown as jest.Mock).mockImplementation(() => ({
      isOpen: true,
      setOpen: jest.fn(),
      messages: [
        {
          id: 'user-1',
          text: 'Hello',
          sender: 'user',
          timestamp: new Date(),
        },
      ],
      addMessage: jest.fn(),
      session: { sessionId: 'test-session' },
      startSession: jest.fn(),
      endSession: jest.fn(),
      isPlanSwitcherLocked: false,
    }));

    let cobrowseResponse = null;
    server.use(
      http.post('/api/v1/chat/cobrowse', async () => {
        cobrowseResponse = {
          status: 'success',
          data: {
            sessionId: 'cobrowse-123',
            code: '123456',
            url: 'https://cobrowse.example.com/session/123456',
          },
        };
        return HttpResponse.json(cobrowseResponse, { status: 200 });
      }),
    );

    render(<TestChatWidget />);

    // Click the cobrowse button
    const cobrowseButton = screen.getByRole('button', {
      name: /Share my screen/i,
    });
    await userEvent.click(cobrowseButton);

    // Consent screen should appear
    expect(
      screen.getByText(/would like to view your screen/i),
    ).toBeInTheDocument();

    // Click consent button
    const consentButton = screen.getByRole('button', { name: /I Agree/i });
    await userEvent.click(consentButton);

    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument();
    });
  });
});
