import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../../../components/chat/core/ChatWidget';
import { ChatConfig, PlanInfo, UserEligibility } from '../../../../models/chat';
import {
  createMockChatConfig,
  createMockPlanInfo,
  createMockUserEligibility,
} from '../../../../tests/mocks/factories';

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

describe('ChatWidget Component', () => {
  // Helper wrapped component for testing
  const TestChatWidget = (
    props: Partial<{
      config: ChatConfig;
      userEligibility: UserEligibility;
      currentPlan: PlanInfo;
      availablePlans: PlanInfo[];
    }> = {},
  ) => {
    const testProps = {
      config: createMockChatConfig(),
      userEligibility: createMockUserEligibility(),
      currentPlan: createMockPlanInfo(),
      availablePlans: [createMockPlanInfo()],
      ...props,
    };
    return <ChatWidget {...testProps} />;
  };

  describe('Initial Render States', () => {
    it('should render the chat form when eligible and within business hours', async () => {
      render(<TestChatWidget />);

      await waitFor(() => {
        expect(screen.getByText('How can we help you?')).toBeInTheDocument();
      });
    });

    it('should show unavailable screen when outside business hours', async () => {
      render(
        <TestChatWidget
          config={createMockChatConfig({
            businessHours: {
              isOpen24x7: false,
              days: [],
            },
          })}
        />,
      );

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
      render(
        <TestChatWidget
          userEligibility={createMockUserEligibility({
            isChatEligibleMember: false,
          })}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByText('Chat is currently unavailable'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Chat Session Management', () => {
    it('should initialize chat session on form submission', async () => {
      render(<TestChatWidget />);

      const serviceTypeSelect = screen.getByLabelText(
        'What can we help you with?',
      );
      const inquiryTypeSelect = screen.getByLabelText(
        'Select your specific inquiry:',
      );
      const startButton = screen.getByRole('button', { name: /Start Chat/i });

      await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');
      await userEvent.selectOptions(inquiryTypeSelect, 'GENERAL');
      await userEvent.click(startButton);

      await waitFor(() => {
        expect(
          screen.getByText('Hi there! How can I assist you today?'),
        ).toBeInTheDocument();
      });
    });

    it('should handle session initialization failure', async () => {
      // Mock the chat API to throw an error
      jest
        .spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network error'));

      render(<TestChatWidget />);

      const serviceTypeSelect = screen.getByLabelText(
        'What can we help you with?',
      );
      const inquiryTypeSelect = screen.getByLabelText(
        'Select your specific inquiry:',
      );
      const startButton = screen.getByRole('button', { name: /Start Chat/i });

      await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');
      await userEvent.selectOptions(inquiryTypeSelect, 'GENERAL');
      await userEvent.click(startButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to start chat session/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Message Handling', () => {
    it('should send and receive chat messages', async () => {
      render(<TestChatWidget />);

      const inputField = screen.getByPlaceholderText('Type your message...');
      const sendButton = screen.getByRole('button', { name: /Send/i });

      await userEvent.type(inputField, 'I need help with my claim');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByText('Thank you for your message. How else can I help?'),
        ).toBeInTheDocument();
      });
    });

    it('should handle message sending failure', async () => {
      // Mock the chat API to throw an error
      jest
        .spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network error'));

      render(<TestChatWidget />);

      const inputField = screen.getByPlaceholderText('Type your message...');
      const sendButton = screen.getByRole('button', { name: /Send/i });

      await userEvent.type(inputField, 'I need help with my claim');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to send message/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cobrowse Functionality', () => {
    it('should initialize cobrowse session', async () => {
      render(<TestChatWidget />);

      const cobrowseButton = screen.getByRole('button', {
        name: /Share my screen/i,
      });
      await userEvent.click(cobrowseButton);

      expect(
        screen.getByText(/would like to view your screen/i),
      ).toBeInTheDocument();

      const consentButton = screen.getByRole('button', { name: /I Agree/i });
      await userEvent.click(consentButton);

      await waitFor(() => {
        expect(screen.getByText('123456')).toBeInTheDocument();
      });
    });

    it('should handle cobrowse initialization failure', async () => {
      // Mock the chat API to throw an error
      jest
        .spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network error'));

      render(<TestChatWidget />);

      const cobrowseButton = screen.getByRole('button', {
        name: /Share my screen/i,
      });
      await userEvent.click(cobrowseButton);

      expect(
        screen.getByText(/would like to view your screen/i),
      ).toBeInTheDocument();

      const consentButton = screen.getByRole('button', { name: /I Agree/i });
      await userEvent.click(consentButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to initialize cobrowse session/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      render(<TestChatWidget />);

      const serviceTypeSelect = screen.getByLabelText(
        'What can we help you with?',
      );
      const inquiryTypeSelect = screen.getByLabelText(
        'Select your specific inquiry:',
      );
      const startButton = screen.getByRole('button', { name: /Start Chat/i });

      expect(serviceTypeSelect).toBeFocusable();
      expect(inquiryTypeSelect).toBeFocusable();
      expect(startButton).toBeFocusable();
    });

    it('should have proper ARIA labels', async () => {
      render(<TestChatWidget />);

      expect(screen.getByRole('form')).toHaveAttribute(
        'aria-label',
        'Chat form',
      );
      expect(
        screen.getByLabelText('What can we help you with?'),
      ).toHaveAttribute('aria-label', 'Service type selection');
      expect(
        screen.getByLabelText('Select your specific inquiry:'),
      ).toHaveAttribute('aria-label', 'Inquiry type selection');
    });
  });
});
