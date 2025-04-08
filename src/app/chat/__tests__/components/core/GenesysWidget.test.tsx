import type {
  ChatPlan,
  ChatState,
  UserEligibility,
} from '@/app/chat/models/types';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { act, render, screen } from '@testing-library/react';
import { GenesysWidget } from '../GenesysWidget';

// Mock the chat store
jest.mock('@/app/chat/stores/chatStore', () => ({
  useChatStore: jest.fn(),
}));

// Mock the chat auth service
jest.mock('@/services/chatService', () => ({
  getAuthToken: jest.fn(),
  updateChatEligibility: jest.fn(),
}));

// Define Genesys types
interface GenesysWidgetConfig {
  dataURL: string;
  userData: {
    firstName: string;
    lastName: string;
    memberID: string;
    PLAN_ID: string;
    GROUP_ID: string;
    LOB: string;
    lob_group: string;
    IsMedicalEligibile: boolean;
    IsDentalEligible: boolean;
    IsVisionEligible: boolean;
    SERV_Type: string;
    INQ_TYPE: string;
    RoutingChatbotInteractionId: string;
    IDCardBotName: string;
    Origin: string;
    Source: string;
  };
  containerEl: HTMLElement;
}

interface GenesysChat {
  createChatWidget: (config: GenesysWidgetConfig) => void;
  updateUserData: (data: Partial<GenesysWidgetConfig['userData']>) => void;
  endSession: () => void;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}

interface GenesysGlobal {
  Chat: GenesysChat;
}

// Mock the window.Genesys object
const mockGenesys = {
  Chat: {
    createChatWidget: jest.fn<void, [GenesysWidgetConfig]>(),
    updateUserData: jest.fn(),
    endSession: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
} as GenesysGlobal;

// Type assertion for the mock functions
(mockGenesys.Chat.createChatWidget as jest.Mock).mockImplementation(() => {});

// Extend Window interface
declare global {
  interface Window {
    Genesys?: GenesysGlobal;
  }
}

describe('GenesysWidget', () => {
  const mockCurrentPlan: ChatPlan = {
    id: 'plan123',
    name: 'Test Plan',
    isChatEligible: true,
    businessHours: {
      isOpen24x7: false,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
    },
    lineOfBusiness: 'Medical',
    termsAndConditions: '',
    isActive: true,
    memberFirstname: 'John',
    memberLastname: 'Doe',
    memberId: '123',
    groupId: '789',
    lobGroup: 'Medical',
    isMedicalEligible: true,
    isDentalEligible: false,
    isVisionEligible: false,
  };

  const mockSession = {
    userId: '123',
    planId: '456',
    groupId: '789',
  };

  const mockEligibility: UserEligibility = {
    isChatEligibleMember: true,
    isDemoMember: false,
    isAmplifyMem: false,
    groupId: 'GROUP456',
    memberClientID: 'MEMBER123',
    getGroupType: 'Standard',
    isBlueEliteGroup: false,
    isMedical: true,
    isDental: false,
    isVision: false,
    isWellnessOnly: false,
    isCobraEligible: false,
    chatHours: 'Monday-Friday: 8:00 AM - 6:00 PM',
    rawChatHours: 'M_F_8_6',
    isChatbotEligible: true,
    memberMedicalPlanID: 'PLAN789',
    isIDCardEligible: true,
    memberDOB: '1990-01-01',
    subscriberID: 'SUB123',
    sfx: '123',
    memberFirstname: 'John',
    memberLastName: 'Doe',
    userID: 'USER123',
    isChatAvailable: true,
    routingchatbotEligible: true,
  };

  const mockState: ChatState = {
    isActive: true,
    isPlanSwitchingLocked: false,
    currentPlan: mockCurrentPlan,
    availablePlans: [],
    businessHours: {
      isOpen24x7: false,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
    },
    eligibility: mockEligibility,
    error: null,
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default store state
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(mockState),
    );

    // Setup window.Genesys mock
    Object.defineProperty(window, 'Genesys', {
      value: mockGenesys,
      writable: true,
      configurable: true,
    });

    // Setup fetch mock
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSession),
      } as Response),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders chat container when active', () => {
    render(<GenesysWidget />);
    const container = screen.getByTestId('genesys-chat-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('h-full');
  });

  it('initializes chat widget when active and within business hours', async () => {
    render(<GenesysWidget />);

    await act(async () => {
      // Wait for script to load
      const script = document.createElement('script');
      script.id = 'genesys-chat-script';
      const loadPromise = new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });
      script.dispatchEvent(new Event('load'));
      await loadPromise;
    });

    const expectedConfig = {
      dataURL: '/api/chat',
      userData: {
        firstName: 'John',
        lastName: 'Doe',
        memberID: '123',
        PLAN_ID: '456',
        GROUP_ID: '789',
        LOB: 'Medical',
        lob_group: 'Medical',
        IsMedicalEligibile: true,
        IsDentalEligible: false,
        IsVisionEligible: false,
        SERV_Type: 'MemberPortal',
        INQ_TYPE: 'MEM',
        RoutingChatbotInteractionId: expect.any(String),
        IDCardBotName: 'idcard-bot',
        Origin: 'MemberPortal',
        Source: 'Web',
      },
      containerEl: document.createElement('div'),
    } as GenesysWidgetConfig;

    expect(mockGenesys.Chat.createChatWidget).toHaveBeenCalledWith(
      expectedConfig,
    );
  });

  it('handles script loading error', async () => {
    render(<GenesysWidget />);

    await act(async () => {
      // Simulate script loading error
      const script = document.createElement('script');
      script.id = 'genesys-chat-script';
      const errorPromise = new Promise<void>((_, reject) => {
        script.onerror = () =>
          reject(new Error('Failed to load Genesys chat script'));
      });
      script.dispatchEvent(new Event('error'));
      try {
        await errorPromise;
      } catch (err) {
        // Expected error in test
      }
    });

    expect(
      screen.getByText('Failed to load chat widget. Please try again.'),
    ).toBeInTheDocument();
  });

  it('handles session initialization error', async () => {
    // Mock fetch to reject
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => Promise.reject(new Error('Auth failed')));

    render(<GenesysWidget />);

    await act(async () => {
      // Wait for script to load
      const script = document.createElement('script');
      script.id = 'genesys-chat-script';
      const loadPromise = new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });
      script.dispatchEvent(new Event('load'));
      await loadPromise;
    });

    expect(
      screen.getByText('Failed to initialize chat session. Please try again.'),
    ).toBeInTheDocument();
  });

  it('updates user data when plan changes', async () => {
    render(<GenesysWidget />);

    await act(async () => {
      // Wait for script to load
      const script = document.createElement('script');
      script.id = 'genesys-chat-script';
      const loadPromise = new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });
      script.dispatchEvent(new Event('load'));
      await loadPromise;
    });

    // Change current plan
    const updatedPlan: ChatPlan = {
      ...mockCurrentPlan,
      lineOfBusiness: 'Dental',
      isMedicalEligible: false,
      isDentalEligible: true,
    };

    const updatedState: ChatState = {
      ...mockState,
      currentPlan: updatedPlan,
    };

    (useChatStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(updatedState),
    );

    // Trigger re-render
    await act(async () => {
      // Force update
      render(<GenesysWidget />);
    });

    expect(mockGenesys.Chat.updateUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        LOB: 'Dental',
        lob_group: 'Dental',
        IsMedicalEligibile: false,
        IsDentalEligible: true,
      }),
    );
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<GenesysWidget />);

    // Add some mock event listeners
    const mockRemoveListener = jest.fn();
    (mockGenesys.Chat.on as jest.Mock).mockImplementation(
      () => mockRemoveListener,
    );

    unmount();

    expect(mockRemoveListener).toHaveBeenCalled();
  });

  it('does not initialize chat when not active', () => {
    const inactiveState: ChatState = {
      ...mockState,
      isActive: false,
    };

    (useChatStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(inactiveState),
    );

    render(<GenesysWidget />);
    expect(mockGenesys.Chat.createChatWidget).not.toHaveBeenCalled();
  });

  it('does not initialize chat when not within business hours', () => {
    const outsideHoursState: ChatState = {
      ...mockState,
      businessHours: {
        ...mockState.businessHours,
        isCurrentlyOpen: false,
      },
    };

    (useChatStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(outsideHoursState),
    );

    render(<GenesysWidget />);
    expect(mockGenesys.Chat.createChatWidget).not.toHaveBeenCalled();
  });
});
