import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  BusinessHours,
  ChatError,
  ChatPlan,
  ChatState,
  UserEligibility,
} from '../../models/types';
import { useChatStore } from '../../stores/chatStore';
import { ChatWidget } from '../core/ChatWidget';

// Mock the chat store
jest.mock('../../stores/chatStore');

// Define the mock store type
type MockStore = ChatState & {
  isOpen: boolean;
  isMinimized: boolean;
  isChatActive: boolean;
  isLoading: boolean;
  messages: never[];
  isWithinBusinessHours: boolean;
  openChat: jest.Mock;
  closeChat: jest.Mock;
  minimizeChat: jest.Mock;
  maximizeChat: jest.Mock;
  startChat: jest.Mock;
  endChat: jest.Mock;
  setCurrentPlan: jest.Mock;
  setAvailablePlans: jest.Mock;
  setBusinessHours: jest.Mock;
  lockPlanSwitcher: jest.Mock;
  unlockPlanSwitcher: jest.Mock;
};

// Define the selector type
type ChatStoreSelector<T> = (state: ChatState) => T;

describe('ChatWidget', () => {
  const mockBusinessHours: BusinessHours = {
    isOpen24x7: false,
    days: [
      {
        day: 'Monday',
        openTime: '09:00',
        closeTime: '17:00',
        isOpen: true,
      },
    ],
    timezone: 'America/New_York',
    isCurrentlyOpen: true,
  };

  const mockEligibility: UserEligibility = {
    isChatEligibleMember: true,
    isDemoMember: false,
    isAmplifyMem: false,
    groupId: 'test-group',
    memberClientID: 'test-client',
    getGroupType: 'test-type',
    isBlueEliteGroup: false,
    isMedical: true,
    isDental: false,
    isVision: false,
    isWellnessOnly: false,
    isCobraEligible: false,
    chatHours: '9-5',
    rawChatHours: '9-5',
    isChatbotEligible: true,
    memberMedicalPlanID: 'test-plan',
    isIDCardEligible: true,
    memberDOB: '1990-01-01',
    subscriberID: 'test-sub',
    sfx: 'test-sfx',
    memberFirstname: 'John',
    memberLastName: 'Doe',
    userID: 'test-user',
    isChatAvailable: true,
    routingchatbotEligible: true,
  };

  const mockPlan: ChatPlan = {
    id: 'test-plan',
    name: 'Test Plan',
    isChatEligible: true,
    lineOfBusiness: 'Medical',
    lobGroup: 'Group1',
    memberFirstname: 'John',
    memberLastname: 'Doe',
    isMedicalEligible: true,
    isDentalEligible: false,
    isVisionEligible: false,
    businessHours: mockBusinessHours,
    termsAndConditions: 'Test terms',
    isActive: true,
  };

  const mockStore: MockStore = {
    // Required ChatState properties
    isActive: false,
    isPlanSwitchingLocked: false,
    currentPlan: mockPlan,
    availablePlans: [mockPlan],
    businessHours: mockPlan.businessHours,
    eligibility: mockEligibility,
    error: null as ChatError | null,

    // Additional properties used in tests
    isOpen: false,
    isMinimized: false,
    isChatActive: false,
    isLoading: false,
    messages: [],
    isWithinBusinessHours: true,

    // Actions
    openChat: jest.fn(),
    closeChat: jest.fn(),
    minimizeChat: jest.fn(),
    maximizeChat: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
    setCurrentPlan: jest.fn(),
    setAvailablePlans: jest.fn(),
    setBusinessHours: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatStore as unknown as jest.Mock).mockImplementation(
      (selector: ChatStoreSelector<unknown>) => selector(mockStore),
    );
  });

  describe('Rendering', () => {
    it('renders ChatButton when not open', () => {
      render(<ChatWidget />);
      expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    });

    it('renders chat interface when open', () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      render(<ChatWidget />);
      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });

    it('renders loading state correctly', () => {
      const loadingStore = { ...mockStore, isOpen: true, isLoading: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(loadingStore as ChatState),
      );
      render(<ChatWidget />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
      const errorStore = {
        ...mockStore,
        isOpen: true,
        error: {
          message: 'Test error',
          code: 'TEST_ERROR',
          isRecoverable: true,
        },
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(errorStore as ChatState),
      );
      render(<ChatWidget />);
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('opens chat on button click', () => {
      render(<ChatWidget />);
      const chatButton = screen.getByRole('button', { name: /chat/i });
      fireEvent.click(chatButton);
      expect(mockStore.openChat).toHaveBeenCalled();
    });

    it('closes chat on close button click', () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      render(<ChatWidget />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(mockStore.closeChat).toHaveBeenCalled();
    });

    it('minimizes chat correctly', () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      render(<ChatWidget />);
      const minimizeButton = screen.getByRole('button', { name: /minimize/i });
      fireEvent.click(minimizeButton);
      expect(mockStore.minimizeChat).toHaveBeenCalled();
    });

    it('maximizes chat correctly', () => {
      const minimizedStore = { ...mockStore, isOpen: true, isMinimized: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(minimizedStore as ChatState),
      );
      render(<ChatWidget />);
      const maximizeButton = screen.getByRole('button', { name: /maximize/i });
      fireEvent.click(maximizeButton);
      expect(mockStore.maximizeChat).toHaveBeenCalled();
    });
  });

  describe('Business Hours', () => {
    it('shows business hours notification when outside hours', () => {
      const outsideHoursStore = {
        ...mockStore,
        isOpen: true,
        businessHours: {
          ...mockStore.businessHours,
          isCurrentlyOpen: false,
        },
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(outsideHoursStore as ChatState),
      );
      render(<ChatWidget />);
      expect(
        screen.getByTestId('business-hours-notification'),
      ).toBeInTheDocument();
    });

    it('hides business hours notification when within hours', () => {
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
      render(<ChatWidget />);
      expect(
        screen.queryByTestId('business-hours-notification'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Plan Management', () => {
    it('shows plan switcher when multiple plans available', () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          mockPlan,
          {
            ...mockPlan,
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
      render(<ChatWidget />);
      expect(screen.getByTestId('plan-switcher')).toBeInTheDocument();
    });

    it('handles plan switching correctly', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          mockPlan,
          {
            ...mockPlan,
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
      render(<ChatWidget />);
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
    it('starts chat session correctly', () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      render(<ChatWidget />);
      const startButton = screen.getByRole('button', { name: /start chat/i });
      fireEvent.click(startButton);
      expect(mockStore.startChat).toHaveBeenCalled();
    });

    it('ends chat session correctly', () => {
      const activeChatStore = {
        ...mockStore,
        isOpen: true,
        isChatActive: true,
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(activeChatStore as ChatState),
      );
      render(<ChatWidget />);
      const endButton = screen.getByRole('button', { name: /end chat/i });
      fireEvent.click(endButton);
      expect(mockStore.endChat).toHaveBeenCalled();
    });
  });

  describe('Plan Information Display', () => {
    it('displays plan info for multiple plans', () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          mockPlan,
          {
            ...mockPlan,
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
      render(<ChatWidget />);
      expect(screen.getByText(mockPlan.name)).toBeInTheDocument();
      expect(screen.getByText('Plan 2')).toBeInTheDocument();
    });

    it('hides plan info for single plan', () => {
      const singlePlanStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [mockPlan],
      };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(singlePlanStore as ChatState),
      );
      render(<ChatWidget />);
      expect(screen.queryByTestId('plan-info')).not.toBeInTheDocument();
    });

    it('updates plan info on plan switch', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          mockPlan,
          {
            ...mockPlan,
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
      render(<ChatWidget />);
      const planSwitcher = screen.getByTestId('plan-switcher');
      fireEvent.change(planSwitcher, { target: { value: 'plan2' } });
      await waitFor(() => {
        expect(screen.getByText('Plan 2')).toBeInTheDocument();
      });
    });
  });

  describe('Terms & Conditions', () => {
    it('updates T&Cs based on LOB', () => {
      const openStore = { ...mockStore, isOpen: true };
      (useChatStore as unknown as jest.Mock).mockImplementation(
        (selector: ChatStoreSelector<unknown>) =>
          selector(openStore as ChatState),
      );
      render(<ChatWidget />);
      expect(screen.getByText(mockPlan.termsAndConditions)).toBeInTheDocument();
    });

    it('handles T&Cs changes on plan switch', async () => {
      const multiplePlansStore = {
        ...mockStore,
        isOpen: true,
        availablePlans: [
          mockPlan,
          {
            ...mockPlan,
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
      render(<ChatWidget />);
      const planSwitcher = screen.getByTestId('plan-switcher');
      fireEvent.change(planSwitcher, { target: { value: 'plan2' } });
      await waitFor(() => {
        expect(screen.getByText('Dental terms')).toBeInTheDocument();
      });
    });
  });
});
