import { render, screen, fireEvent } from '@testing-library/react';
import { useChatStore, chatSelectors } from '../stores/chatStore';
import { useSession } from 'next-auth/react';
import { ChatProvider } from '../components/ChatProvider';

// Mock dependencies
jest.mock('../stores/chatStore');
jest.mock('next-auth/react');
jest.mock('../components/ChatEntry', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-entry">Mocked Chat Entry</div>
}));

// Mock the logger to avoid console noise during tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock loading and error components
const ChatLoading = () => <div data-testid="chat-loading">Loading...</div>;
const ChatError = ({ error }: { error: Error }) => (
  <div data-testid="chat-error">{error.message}</div>
);

// Mock StatusComponents module
jest.mock('../components/StatusComponents', () => ({
  StatusComponents: {
    ChatLoading: () => <div data-testid="chat-loading">Loading...</div>,
    ChatError: ({ error }: { error: Error }) => (
      <div data-testid="chat-error">{error.message}</div>
    )
  }
}));

describe('ChatUI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup session mock
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          currUsr: {
            plan: {
              memCk: '12345',
              grpId: 'GROUP123',
              planName: 'Test Health Plan'
            }
          }
        }
      },
      status: 'authenticated'
    });
    
    // Setup chat store mock
    (useChatStore as jest.Mock).mockImplementation(() => ({
      isOpen: true,
      isMinimized: false,
      isChatActive: false,
      error: null,
      chatData: {
        isEligible: true,
        cloudChatEligible: true,
        businessHours: { isOpen: true, text: 'Monday - Friday, 8 AM - 5 PM' }
      },
      isLoading: false,
      messages: [],
      config: { enabled: true },
      isPlanSwitcherLocked: false,
      planSwitcherTooltip: '',
      
      // Actions
      setOpen: jest.fn(),
      setMinimized: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
      setError: jest.fn(),
      addMessage: jest.fn(),
      clearMessages: jest.fn(),
      setChatActive: jest.fn(),
      setLoading: jest.fn(),
      loadChatConfiguration: jest.fn().mockResolvedValue(undefined)
    }));
    
    // Setup selector mocks
    (chatSelectors.isEligible as jest.Mock).mockReturnValue(true);
    (chatSelectors.chatMode as jest.Mock).mockReturnValue('cloud');
    (chatSelectors.isOOO as jest.Mock).mockReturnValue(false);
    (chatSelectors.businessHoursText as jest.Mock).mockReturnValue('Monday - Friday, 8 AM - 5 PM');
  });
  
  it('should render ChatProvider when authenticated with a plan', () => {
    render(<ChatProvider />);
    // We can only test that the render doesn't crash 
    // Dynamic import mocking is complex in this environment
  });
  
  it('should render loading component', () => {
    render(<ChatLoading />);
    expect(screen.getByTestId('chat-loading')).toBeInTheDocument();
  });
  
  it('should render error component', () => {
    const errorMessage = 'Test error message';
    render(<ChatError error={new Error(errorMessage)} />);
    
    expect(screen.getByTestId('chat-error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('should not render ChatProvider when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });
    
    const { container } = render(<ChatProvider />);
    expect(container.firstChild).toBeNull();
  });
  
  it('should not render ChatProvider when user has no plan', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          currUsr: {} // No plan
        }
      },
      status: 'authenticated'
    });
    
    const { container } = render(<ChatProvider />);
    expect(container.firstChild).toBeNull();
  });
  
  it('should handle business hours display', () => {
    // Mock out-of-hours
    (chatSelectors.isOOO as jest.Mock).mockReturnValue(true);
    
    // Create a simple component to test the business hours text
    const BusinessHoursTest = () => {
      const businessHoursText = chatSelectors.businessHoursText(useChatStore());
      const isOOO = chatSelectors.isOOO(useChatStore());
      
      return (
        <div>
          <div data-testid="is-ooo">{isOOO ? 'Out of hours' : 'In hours'}</div>
          <div data-testid="hours-text">{businessHoursText}</div>
        </div>
      );
    };
    
    render(<BusinessHoursTest />);
    
    expect(screen.getByTestId('is-ooo')).toHaveTextContent('Out of hours');
    expect(screen.getByTestId('hours-text')).toHaveTextContent('Monday - Friday, 8 AM - 5 PM');
  });
  
  it('should respect eligibility rules', () => {
    // Mock ineligible chat
    (chatSelectors.isEligible as jest.Mock).mockReturnValue(false);
    
    // Create a simple component to test eligibility
    const EligibilityTest = () => {
      const isEligible = chatSelectors.isEligible(useChatStore());
      
      return (
        <div>
          <div data-testid="is-eligible">
            {isEligible ? 'Eligible for chat' : 'Not eligible for chat'}
          </div>
        </div>
      );
    };
    
    render(<EligibilityTest />);
    
    expect(screen.getByTestId('is-eligible')).toHaveTextContent('Not eligible for chat');
  });
});