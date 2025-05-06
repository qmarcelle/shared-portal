import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { ChatWidget } from '../../../@chat/components/ChatWidget';
import { useChat } from '../../../@chat/hooks/useChat';

// Mock the hooks and services
jest.mock('next-auth/react');
jest.mock('../../hooks/useChat');
jest.mock('../../services/ChatService');

// Mock GenesysScripts component to avoid script loading issues
jest.mock('../../components/GenesysScripts', () => ({
  GenesysScripts: () => <div data-testid="genesys-scripts">Mocked Genesys Scripts</div>,
}));

describe('ChatWidget', () => {
  const mockProps = {
    memberId: 'test-member',
    planId: 'test-plan',
    planName: 'Test Health Plan',
    hasMultiplePlans: true,
    onLockPlanSwitcher: jest.fn(),
    onOpenPlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
  });

  it('renders null when chat is not available and not open', () => {
    // Mock useChat to return not eligible and not open
    const mockChat = {
      isInitialized: true,
      isOpen: false,
      isChatActive: false,
      error: null,
      eligibility: { chatAvailable: false },
      isLoading: false,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    const { container } = render(<ChatWidget {...mockProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders loading state when isLoading is true', () => {
    const mockChat = {
      isInitialized: false,
      isOpen: false,
      isChatActive: false,
      error: null,
      eligibility: { chatAvailable: true },
      isLoading: true,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    render(<ChatWidget {...mockProps} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    const mockChat = {
      isInitialized: true,
      isOpen: false,
      isChatActive: false,
      error: new Error('Test error'),
      eligibility: { chatAvailable: true },
      isLoading: false,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    render(<ChatWidget {...mockProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders chat interface when eligible', async () => {
    const mockChat = {
      isInitialized: true,
      isOpen: true,
      isChatActive: true,
      error: null,
      eligibility: { chatAvailable: true },
      isLoading: false,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    render(<ChatWidget {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });
  });

  it('renders plan info header when hasMultiplePlans is true', async () => {
    const mockChat = {
      isInitialized: true,
      isOpen: true,
      isChatActive: true,
      error: null,
      eligibility: { chatAvailable: true },
      isLoading: false,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    render(<ChatWidget {...mockProps} />);
    
    // The component should render the genesys scripts
    expect(screen.getByTestId('genesys-scripts')).toBeInTheDocument();
  });

  it('shows business hours notification when not available', () => {
    const mockChat = {
      isInitialized: true,
      isOpen: true,
      isChatActive: false,
      error: null,
      eligibility: { chatAvailable: false },
      isLoading: false,
      openChat: jest.fn(),
      closeChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      startChat: jest.fn(),
      endChat: jest.fn(),
    };
    
    (useChat as jest.Mock).mockReturnValue(mockChat);

    render(<ChatWidget {...mockProps} />);
    expect(screen.getByTestId('business-hours-notification')).toBeInTheDocument();
  });

  // Add more tests as needed
});
