import BusinessHoursBanner from '@/app/@chat/components/BusinessHoursBanner';
import ChatControls from '@/app/@chat/components/ChatControls';
import ChatWidget from '@/app/@chat/components/ChatWidget';
import PlanInfoHeader from '@/app/@chat/components/PlanInfoHeader';
import PlanSwitcherButton from '@/app/@chat/components/PlanSwitcherButton';
import PreChatWindow from '@/app/@chat/components/PreChatWindow';
import TermsAndConditions from '@/app/@chat/components/TermsAndConditions';
import { ChatState, useChatStore } from '@/app/@chat/stores/chatStore';
import { PlanState, usePlanStore } from '@/userManagement/stores/planStore';
import { render, screen } from '@testing-library/react';

// Mock Zustand stores
jest.mock('@/app/@chat/stores/chatStore');
jest.mock('@/userManagement/stores/planStore');

// Helpers for mocking Zustand stores with proper types
const mockUseChatStore = (state: Partial<ChatState>) => {
  (useChatStore as unknown as jest.Mock).mockImplementation(() => state);
};
const mockUsePlanStore = (state: Partial<PlanState>) => {
  (usePlanStore as unknown as jest.Mock).mockImplementation(() => state);
};

describe('Chat Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ChatWidget and disables button when not eligible', () => {
    mockUseChatStore({
      isEligible: false,
      isOOO: false,
      isChatActive: false,
      startChat: jest.fn(),
    });
    render(<ChatWidget>child</ChatWidget>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows BusinessHoursBanner when out of office', () => {
    mockUseChatStore({
      isOOO: true,
      businessHoursText: '9am-5pm',
    });
    render(<BusinessHoursBanner />);
    expect(screen.getByText(/Our chat is closed/)).toBeInTheDocument();
  });

  it('shows PlanInfoHeader with correct plan', () => {
    mockUseChatStore({
      formInputs: [
        { id: 'MEMBER_ID', value: '123' },
        { id: 'PLAN_ID', value: 'BlueCare' },
      ],
    });
    render(<PlanInfoHeader />);
    expect(
      screen.getByText(/You are chatting about plan BlueCare/),
    ).toBeInTheDocument();
  });

  it('renders PlanSwitcherButton only with multiple plans', () => {
    mockUsePlanStore({
      plans: [{ id: '1' }, { id: '2' }],
      selectedPlanId: '1',
      openPlanSwitcher: jest.fn(),
    });
    mockUseChatStore({ endChat: jest.fn() });
    render(<PlanSwitcherButton />);
    expect(screen.getByText(/Switch Plan/)).toBeInTheDocument();
  });

  it('renders PreChatWindow with plan and start button', () => {
    mockUsePlanStore({
      plans: [{ id: '1', name: 'BlueCare' }],
      selectedPlanId: '1',
      openPlanSwitcher: jest.fn(),
    });
    mockUseChatStore({ startChat: jest.fn() });
    render(<PreChatWindow />);
    expect(screen.getByText(/BlueCare/)).toBeInTheDocument();
    expect(screen.getByText(/Start Chat/)).toBeInTheDocument();
  });

  it('renders TermsAndConditions', () => {
    mockUseChatStore({ userData: {} });
    render(<TermsAndConditions />);
    expect(screen.getByText(/Terms and Conditions/)).toBeInTheDocument();
  });

  it('shows ChatControls when chat is active', () => {
    mockUseChatStore({
      isChatActive: true,
      isMinimized: false,
      endChat: jest.fn(),
      minimizeChat: jest.fn(),
      maximizeChat: jest.fn(),
    });
    render(<ChatControls />);
    expect(screen.getByLabelText(/Minimize chat/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Close chat/)).toBeInTheDocument();
  });
});
