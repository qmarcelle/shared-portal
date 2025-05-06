import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenesysChat } from '@/components/GenesysChat';
import {
  ChatActions,
  ChatState,
  useChatStore,
} from '../../../stores/chatStore';

// Mock the stores
jest.mock('../../../stores/chatStore', () => ({
  useChatStore: jest.fn(),
}));
jest.mock('../../../stores/uiStore');

const mockStore = useChatStore as jest.MockedFunction<typeof useChatStore>;

describe('GenesysChat', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default store state
    mockStore.mockReturnValue({
      isAuthenticated: true,
      error: null,
      currentPlan: null,
      eligibility: mockUserEligibility,
      initializeSession: jest.fn(),
      clearSession: jest.fn(),
    } as unknown as ChatState & ChatActions);
  });

  it('renders chat widget when authenticated', async () => {
    render(<GenesysChat />);
    await waitFor(() => {
      expect(screen.getByTestId('chat-widget')).toBeInTheDocument();
    });
  });

  it('shows error message when authentication fails', async () => {
    mockStore.mockReturnValue({
      isAuthenticated: false,
      error: new Error('Authentication failed'),
      initializeSession: jest.fn(),
    } as unknown as ChatState & ChatActions);

    render(<GenesysChat />);
    await waitFor(() => {
      expect(screen.getByText(/authentication failed/i)).toBeInTheDocument();
    });
  });

  it('handles plan switching correctly', async () => {
    const mockSwitchPlan = jest.fn();
    mockStore.mockReturnValue({
      isAuthenticated: true,
      currentPlan: { id: 'plan1', name: 'Test Plan' },
      switchPlan: mockSwitchPlan,
    } as unknown as ChatState & ChatActions);

    render(<GenesysChat />);
    const switchButton = screen.getByRole('button', { name: /switch plan/i });
    await userEvent.click(switchButton);

    expect(mockSwitchPlan).toHaveBeenCalled();
  });

  it('maintains chat state during plan switch', async () => {
    const mockMessages = [{ id: '1', content: 'Test message', sender: 'user' }];
    mockStore.mockReturnValue({
      isAuthenticated: true,
      messages: mockMessages,
      currentPlan: { id: 'plan1', name: 'Test Plan' },
    } as unknown as ChatState & ChatActions);

    render(<GenesysChat />);
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('handles business hours restrictions', async () => {
    mockStore.mockReturnValue({
      isAuthenticated: true,
      currentPlan: {
        id: 'plan1',
        businessHours: {
          isOpen24x7: false,
          isCurrentlyOpen: false,
        },
      },
    } as unknown as ChatState & ChatActions);

    render(<GenesysChat />);
    await waitFor(() => {
      expect(
        screen.getByText(/chat is currently unavailable/i),
      ).toBeInTheDocument();
    });
  });

  it('recovers from connection errors', async () => {
    const mockReconnect = jest.fn();
    mockStore.mockReturnValue({
      isAuthenticated: true,
      error: new Error('Connection lost'),
      reconnect: mockReconnect,
    } as unknown as ChatState & ChatActions);

    render(<GenesysChat />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await userEvent.click(retryButton);

    expect(mockReconnect).toHaveBeenCalled();
  });
});
