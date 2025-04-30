import {
  BusinessHours,
  ChatConfig,
  ChatError,
  ChatMessage,
  ChatSession,
  ChatState,
  PlanInfo,
  UserInfo,
} from '@/app/chat/types/index';
import {
  act,
  cleanup,
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { setupWindowMocks } from '../../__tests__/utils/test-utils';
import type { ChatWidgetProps } from '../../components/ChatWidget';
import { ChatWidget } from '../../components/ChatWidget';
import { useChatEligibility } from '../../hooks/useChatEligibility';
import { useChatStore } from '../../stores/chatStore';

// Mock the hooks
jest.mock('../../hooks/useChatEligibility');
jest.mock('../../stores/chatStore');

// Mock the foundation Button component
jest.mock('@/components/foundation/Button', () => ({
  Button: ({
    type,
    label,
    callback,
    className,
  }: {
    type: string;
    label: string;
    callback: () => void;
    className?: string;
  }) => (
    <button
      onClick={callback}
      className={`${type} ${className || ''}`}
      data-testid={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      role="button"
    >
      {label}
    </button>
  ),
}));

interface MockStore extends ChatState {
  isInitialized: boolean;
  isChatActive: boolean;
  eligibility: {
    chatAvailable: boolean;
    reason?: string;
  };
  openChat: jest.Mock;
  closeChat: jest.Mock;
  setError: jest.Mock;
  clearError: jest.Mock;
  setMessages: jest.Mock;
  addMessage: jest.Mock;
  setPlan: jest.Mock;
  setSession: jest.Mock;
  lockPlanSwitcher: jest.Mock;
  unlockPlanSwitcher: jest.Mock;
  minimizeChat: jest.Mock;
  maximizeChat: jest.Mock;
  startChat: jest.Mock;
  endChat: jest.Mock;
  setCurrentPlan: jest.Mock;
  businessHours: {
    isCurrentlyOpen: boolean;
  };
  isLoading: boolean;
}

const defaultBusinessHours: BusinessHours = {
  format: 'DAY_DAY_HOUR_HOUR',
  value: 'M_F_8_6',
  timezone: 'America/New_York',
  days: [
    {
      day: 'Monday',
      hours: '8:00 AM - 6:00 PM',
    },
    {
      day: 'Tuesday',
      hours: '8:00 AM - 6:00 PM',
    },
    {
      day: 'Wednesday',
      hours: '8:00 AM - 6:00 PM',
    },
    {
      day: 'Thursday',
      hours: '8:00 AM - 6:00 PM',
    },
    {
      day: 'Friday',
      hours: '8:00 AM - 6:00 PM',
    },
  ],
};

const defaultPlan: PlanInfo = {
  id: 'plan1',
  name: 'Test Plan',
  groupId: 'group1',
  description: 'Test Plan Description',
  businessHours: defaultBusinessHours,
  lineOfBusiness: 'Medical',
  hasMultiplePlans: false,
  termsAndConditions: 'Test Terms and Conditions',
} as const;

// Define the selector type
type ChatStoreSelector<T> = (state: ChatState) => T;

describe('ChatWidget', () => {
  setupWindowMocks();

  const mockStore: MockStore = {
    // Required ChatState properties
    isInitialized: true,
    isOpen: false,
    isInChat: false,
    isChatActive: false,
    messages: [] as ChatMessage[],
    currentPlan: defaultPlan,
    error: null,
    isPlanSwitcherLocked: false,
    session: null as ChatSession | null,
    eligibility: {
      chatAvailable: true,
    },
    isLoading: false,

    // Mock functions
    openChat: jest.fn(),
    closeChat: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
    setMessages: jest.fn(),
    addMessage: jest.fn(),
    setPlan: jest.fn(),
    setSession: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    minimizeChat: jest.fn(),
    maximizeChat: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
    setCurrentPlan: jest.fn(),

    // Additional properties
    businessHours: {
      isCurrentlyOpen: true,
    },
  };

  const mockEligibility = {
    chatAvailable: true,
    cloudChatEligible: true,
    loading: false,
  };

  const defaultConfig: ChatConfig = {
    env: {
      provider: 'cloud',
      features: {
        planSwitching: true,
        businessHours: true,
      },
    },
    businessHours: {
      format: 'DAY_DAY_HOUR_HOUR',
      timezone: 'America/New_York',
    },
    styling: {
      theme: {
        primaryColor: '#007bff',
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
      typography: {
        fontFamily: 'Arial, sans-serif',
      },
    },
  };

  const defaultUserData: UserInfo = {
    memberId: 'test-member',
    planId: 'test-plan',
    planName: 'Test Plan',
    hasMultiplePlans: false,
  };

  const defaultProps: ChatWidgetProps = {
    memberId: 'test-member',
    planId: 'test-plan',
    planName: 'Test Plan',
    hasMultiplePlans: false,
    onLockPlanSwitcher: jest.fn(),
    onOpenPlanSwitcher: jest.fn(),
    onError: jest.fn(),
    onSwitchPlan: jest.fn(),
  };

  const renderWidget = async (props = defaultProps): Promise<RenderResult> => {
    let rendered: RenderResult | undefined;

    // Clear any previous renders
    cleanup();

    // Reset all mocks before each render
    jest.clearAllMocks();

    // Setup default mock implementations
    (useChatStore as unknown as jest.Mock).mockImplementation(
      (selector: ChatStoreSelector<unknown>) => {
        if (typeof selector === 'function') {
          return selector(mockStore as ChatState);
        }
        return mockStore;
      },
    );
    (useChatEligibility as jest.Mock).mockReturnValue(mockEligibility);

    await act(async () => {
      rendered = render(<ChatWidget {...props} />);
      // Wait for any immediate effects to complete
      await Promise.resolve();
    });

    if (!rendered) {
      throw new Error('Failed to render component');
    }

    // Wait for any async effects to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    return rendered;
  };

  beforeEach(() => {
    // Setup window mocks
    setupWindowMocks();

    // Mock Genesys window object
    (window as any).Genesys = {
      WebMessenger: {
        on: jest.fn(),
        off: jest.fn(),
        destroy: jest.fn(),
      },
      Chat: {
        on: jest.fn(),
        off: jest.fn(),
        destroy: jest.fn(),
      },
    };
  });

  afterEach(async () => {
    await act(async () => {
      cleanup();
      jest.clearAllMocks();
      delete (window as any).Genesys;
    });
  });

  describe('Rendering', () => {
    it('renders chat trigger button when not open', async () => {
      await renderWidget();
      expect(screen.getByTestId('button-chat-with-us')).toBeInTheDocument();
      expect(screen.getByTestId('button-chat-with-us')).toHaveClass('primary');
    });

    it('renders chat interface when open', async () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          typeof selector === 'function' ? selector(openStore) : openStore,
      );
      await renderWidget();
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      expect(screen.getByTestId('button-start-chat')).toBeInTheDocument();
    });

    it('renders chat controls when chat is active', async () => {
      const activeChatStore = {
        ...mockStore,
        isOpen: true,
        isChatActive: true,
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          typeof selector === 'function'
            ? selector(activeChatStore)
            : activeChatStore,
      );
      const { getByRole } = await renderWidget();
      expect(getByRole('button', { name: 'End chat' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Minimize' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Maximize' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('renders loading state correctly', async () => {
      const loadingStore = { ...mockStore, isOpen: true, isLoading: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          typeof selector === 'function'
            ? selector(loadingStore)
            : loadingStore,
      );
      const { getByTestId } = await renderWidget();
      expect(getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders error state correctly', async () => {
      const errorStore = {
        ...mockStore,
        isOpen: true,
        error: new ChatError('Test error', 'TEST_ERROR', 'error'),
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          typeof selector === 'function' ? selector(errorStore) : errorStore,
      );
      const { getByText } = await renderWidget();
      expect(getByText('Test error')).toBeInTheDocument();
    });

    it('renders without crashing', async () => {
      await renderWidget();
    });

    it('shows error message when there is an error', async () => {
      mockStore.error = new ChatError('Test error', 'TEST_ERROR', 'error');
      await renderWidget();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('opens chat when button is clicked', async () => {
      await renderWidget();
      const button = screen.getByTestId('button-chat-with-us');
      await act(async () => {
        fireEvent.click(button);
      });
      expect(mockStore.openChat).toHaveBeenCalled();
    });

    it('closes chat when close button is clicked', async () => {
      const activeChatStore = {
        ...mockStore,
        isOpen: true,
        isChatActive: true,
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(activeChatStore as ChatState),
      );
      await renderWidget();
      const button = screen.getByTestId('button-close');
      await act(async () => {
        fireEvent.click(button);
      });
      expect(mockStore.closeChat).toHaveBeenCalled();
    });

    it('shows plan switcher when multiple plans are available', async () => {
      await renderWidget({ ...defaultProps, hasMultiplePlans: true });
      expect(screen.getByTestId('plan-switcher')).toBeInTheDocument();
    });

    it('calls onSwitchPlan when plan is switched', async () => {
      await renderWidget({ ...defaultProps, hasMultiplePlans: true });
      const switcher = screen.getByTestId('plan-switcher');
      fireEvent.click(switcher);
      expect(defaultProps.onSwitchPlan).toHaveBeenCalled();
    });

    it('minimizes chat correctly', async () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      await renderWidget();
      const minimizeButton = screen.getByTestId('button-minimize');
      fireEvent.click(minimizeButton);
      expect(mockStore.minimizeChat).toHaveBeenCalled();
    });

    it('maximizes chat correctly', async () => {
      const minimizedStore = { ...mockStore, isOpen: true, isMinimized: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(minimizedStore as ChatState),
      );
      await renderWidget();
      const maximizeButton = screen.getByTestId('button-maximize');
      fireEvent.click(maximizeButton);
      expect(mockStore.maximizeChat).toHaveBeenCalled();
    });
  });

  describe('Business Hours', () => {
    it('shows business hours notification when outside hours', async () => {
      const outsideHoursStore = {
        ...mockStore,
        isOpen: true,
        eligibility: {
          chatAvailable: false,
          reason: 'Outside business hours',
        },
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(outsideHoursStore as ChatState),
      );
      await renderWidget();
      expect(
        screen.getByText(/outside of business hours/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/9:00 AM - 5:00 PM/i)).toBeInTheDocument();
    });

    it('hides business hours notification when within hours', async () => {
      const withinHoursStore = {
        ...mockStore,
        isOpen: true,
        businessHours: {
          ...mockStore.businessHours,
          isCurrentlyOpen: true,
        },
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(withinHoursStore as ChatState),
      );
      await renderWidget();
      expect(
        screen.queryByTestId('business-hours-notification'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Plan Management', () => {
    it('shows plan switcher when multiple plans available', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          defaultPlan,
          {
            ...defaultPlan,
            id: 'plan2',
            name: 'Plan 2',
            lineOfBusiness: 'Dental',
          },
        ],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(multiplePlansStore as ChatState),
      );
      await renderWidget();
      expect(screen.getByTestId('plan-switcher')).toBeInTheDocument();
    });

    it('handles plan switching correctly', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          defaultPlan,
          {
            ...defaultPlan,
            id: 'plan2',
            name: 'Plan 2',
            lineOfBusiness: 'Dental',
          },
        ],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(multiplePlansStore as ChatState),
      );
      await renderWidget();
      const planSwitcher = screen.getByTestId('plan-switcher');
      fireEvent.change(planSwitcher, { target: { value: 'plan2' } });
      await waitFor(() => {
        expect(mockStore.setCurrentPlan).toHaveBeenCalledWith(
          multiplePlansStore.availablePlans[1],
        );
      });
    });
  });

  describe('Chat Session', () => {
    it('starts chat session correctly', async () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      await renderWidget();
      const startButton = screen.getByTestId('button-start-chat');
      fireEvent.click(startButton);
      expect(mockStore.startChat).toHaveBeenCalled();
    });

    it('ends chat session correctly', async () => {
      const activeChatStore = {
        ...mockStore,
        isOpen: true,
        isChatActive: true,
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(activeChatStore as ChatState),
      );
      await renderWidget();
      const endButton = screen.getByTestId('button-end-chat');
      fireEvent.click(endButton);
      expect(mockStore.endChat).toHaveBeenCalled();
    });
  });

  describe('Plan Information Display', () => {
    it('displays plan info for multiple plans', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          defaultPlan,
          {
            ...defaultPlan,
            id: 'plan2',
            name: 'Plan 2',
            lineOfBusiness: 'Dental',
          },
        ],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(multiplePlansStore as ChatState),
      );
      await renderWidget();
      expect(screen.getByText(defaultPlan.name)).toBeInTheDocument();
      expect(screen.getByText('Plan 2')).toBeInTheDocument();
    });

    it('hides plan info for single plan', async () => {
      const singlePlanStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [defaultPlan],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(singlePlanStore as ChatState),
      );
      await renderWidget();
      expect(screen.queryByTestId('plan-info')).not.toBeInTheDocument();
    });

    it('updates plan info on plan switch', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          defaultPlan,
          {
            ...defaultPlan,
            id: 'plan2',
            name: 'Plan 2',
            lineOfBusiness: 'Dental',
          },
        ],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(multiplePlansStore as ChatState),
      );
      await renderWidget();
      const planSwitcher = screen.getByTestId('plan-switcher');
      fireEvent.change(planSwitcher, { target: { value: 'plan2' } });
      await waitFor(() => {
        expect(screen.getByText('Plan 2')).toBeInTheDocument();
      });
    });
  });

  describe('Terms & Conditions', () => {
    it('updates T&Cs based on LOB', async () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      await renderWidget();
      expect(
        screen.getByText(defaultPlan.termsAndConditions || ''),
      ).toBeInTheDocument();
    });

    it('handles T&Cs changes on plan switch', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          defaultPlan,
          {
            ...defaultPlan,
            id: 'plan2',
            name: 'Plan 2',
            lineOfBusiness: 'Dental',
            termsAndConditions: 'Dental terms',
          },
        ],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) => selector(multiplePlansStore),
      );
      await renderWidget();
      const planSwitcher = screen.getByTestId('plan-switcher');
      fireEvent.change(planSwitcher, { target: { value: 'plan2' } });
      await waitFor(() => {
        expect(screen.getByText('Dental terms')).toBeInTheDocument();
      });
    });
  });
});
