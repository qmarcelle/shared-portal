import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '@/components/ChatWidget';
import { ChatService } from '../../services/ChatService';
import { useChatStore } from '../../stores/chatStore';

// Mock the chat service
jest.mock('../../services/ChatService', () => ({
  ChatService: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
  })),
}));

describe('Chat Flow Integration', () => {
  const mockFetch = global.fetch as jest.Mock;
  const defaultProps = {
    memberId: 'test-member',
    planId: 'test-plan',
    planName: 'Test Plan',
    hasMultiplePlans: false,
    onLockPlanSwitcher: jest.fn(),
    onOpenPlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks and stores
    jest.clearAllMocks();
    const store = useChatStore.getState();
    act(() => {
      store.setError(null);
      store.messages = [];
    });
  });

  it('completes a successful chat session flow', async () => {
    // Mock successful API responses
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isEligible: true,
            businessHours: {
              isOpen: true,
              currentHours: '9:00 AM - 5:00 PM',
            },
          }),
      }),
    );

    const user = userEvent.setup();

    // Render the chat widget
    render(<ChatWidget {...defaultProps} />);

    // Verify initial state
    expect(screen.getByRole('button', { name: /chat with us/i })).toBeEnabled();

    // Start chat
    await user.click(screen.getByRole('button', { name: /chat with us/i }));

    // Verify chat window opens
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /chat/i })).toBeVisible();
    });

    // Type and send a message
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    await user.type(messageInput, 'Hello, I need help');
    await user.click(screen.getByRole('button', { name: /send/i }));

    // Verify message appears in chat
    await waitFor(() => {
      expect(screen.getByText('Hello, I need help')).toBeInTheDocument();
    });

    // Verify message was sent through service
    const mockChatService = new ChatService(
      'test-member',
      'test-plan',
      'Test Plan',
      false,
      jest.fn(),
    );
    expect(mockChatService.sendMessage).toHaveBeenCalledWith(
      'Hello, I need help',
    );
  });

  it('handles business hours restrictions', async () => {
    // Mock API response for closed business hours
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isEligible: true,
            businessHours: {
              isOpen: false,
              currentHours: '9:00 AM - 5:00 PM',
            },
          }),
      }),
    );

    const user = userEvent.setup();
    render(<ChatWidget {...defaultProps} />);

    // Try to start chat
    await user.click(screen.getByRole('button', { name: /chat with us/i }));

    // Verify business hours message
    await waitFor(() => {
      expect(
        screen.getByText(/outside of business hours/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/9:00 AM - 5:00 PM/i)).toBeInTheDocument();
    });
  });

  it('handles plan switching during chat', async () => {
    // Mock successful API responses
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isEligible: true,
            businessHours: {
              isOpen: true,
              currentHours: '9:00 AM - 5:00 PM',
            },
          }),
      }),
    );

    const user = userEvent.setup();
    render(<ChatWidget {...defaultProps} hasMultiplePlans={true} />);

    // Start chat
    await user.click(screen.getByRole('button', { name: /chat with us/i }));

    // Switch plans
    const planSwitcher = screen.getByRole('button', { name: /switch plan/i });
    await user.click(planSwitcher);

    // Verify plan switcher warning
    await waitFor(() => {
      expect(
        screen.getByText(/switching plans will end current chat/i),
      ).toBeInTheDocument();
    });

    // Confirm plan switch
    await user.click(screen.getByRole('button', { name: /confirm switch/i }));

    // Verify chat ended and new chat started
    const mockChatService = new ChatService(
      'test-member',
      'test-plan',
      'Test Plan',
      true,
      jest.fn(),
    );
    expect(mockChatService.endChat).toHaveBeenCalled();
    expect(mockChatService.startChat).toHaveBeenCalled();
  });

  it('handles error scenarios gracefully', async () => {
    // Mock failed API response
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error')),
    );

    const user = userEvent.setup();
    render(<ChatWidget {...defaultProps} />);

    // Try to start chat
    await user.click(screen.getByRole('button', { name: /chat with us/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/unable to start chat/i)).toBeInTheDocument();
      expect(screen.getByText(/please try again/i)).toBeInTheDocument();
    });

    // Verify retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeEnabled();

    // Mock successful response for retry
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isEligible: true,
            businessHours: {
              isOpen: true,
              currentHours: '9:00 AM - 5:00 PM',
            },
          }),
      }),
    );

    // Retry chat
    await user.click(retryButton);

    // Verify chat recovers
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /chat/i })).toBeVisible();
    });
  });

  it('handles file attachments', async () => {
    // Mock successful API responses
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            isEligible: true,
            businessHours: {
              isOpen: true,
              currentHours: '9:00 AM - 5:00 PM',
            },
          }),
      }),
    );

    const user = userEvent.setup();
    render(<ChatWidget {...defaultProps} />);

    // Start chat
    await user.click(screen.getByRole('button', { name: /chat with us/i }));

    // Upload file
    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const fileInput = screen.getByLabelText(/attach file/i);
    await user.upload(fileInput, file);

    // Verify file upload UI
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send file/i })).toBeEnabled();
    });

    // Send file
    await user.click(screen.getByRole('button', { name: /send file/i }));

    // Verify file sent
    await waitFor(() => {
      expect(screen.getByText(/file sent successfully/i)).toBeInTheDocument();
    });
  });
});
