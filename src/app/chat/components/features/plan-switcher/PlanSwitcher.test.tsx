import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePlanSwitcher } from '../../../hooks/usePlanSwitcher';
import { ChatPlan } from '../../../models/types';
import { PlanSwitcher } from './PlanSwitcher';

// Mock the usePlanSwitcher hook
jest.mock('../../../hooks/usePlanSwitcher');

describe('PlanSwitcher', () => {
  const mockPlans: ChatPlan[] = [
    {
      id: 'plan1',
      name: 'Medical Plan',
      lineOfBusiness: 'Medical',
      isEligibleForChat: true,
      isActive: true,
      businessHours: {
        isOpen24x7: true,
        days: [],
        timezone: 'UTC',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'default',
      },
      termsAndConditions: '',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'member1',
      groupId: 'group1',
      isMedicalEligible: true,
      isDentalEligible: false,
      isVisionEligible: false,
      lobGroup: 'Medical',
    },
    {
      id: 'plan2',
      name: 'Dental Plan',
      lineOfBusiness: 'Dental',
      isEligibleForChat: true,
      isActive: true,
      businessHours: {
        isOpen24x7: true,
        days: [],
        timezone: 'UTC',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'default',
      },
      termsAndConditions: '',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'member1',
      groupId: 'group1',
      isMedicalEligible: false,
      isDentalEligible: true,
      isVisionEligible: false,
      lobGroup: 'Dental',
    },
  ];

  beforeEach(() => {
    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: mockPlans,
      selectedPlan: mockPlans[0],
      status: 'success',
      error: null,
      switchPlan: jest.fn(),
    });
  });

  it('renders plan options when multiple plans are available', () => {
    render(<PlanSwitcher />);

    expect(screen.getByText('Medical Plan')).toBeInTheDocument();
    expect(screen.getByText('Dental Plan')).toBeInTheDocument();
    expect(screen.getByText('Current: Medical Plan')).toBeInTheDocument();
  });

  it('does not render when only one plan is available', () => {
    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: [mockPlans[0]],
      selectedPlan: mockPlans[0],
      status: 'success',
      error: null,
      switchPlan: jest.fn(),
    });

    const { container } = render(<PlanSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading state', () => {
    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: [],
      selectedPlan: null,
      status: 'loading',
      error: null,
      switchPlan: jest.fn(),
    });

    render(<PlanSwitcher />);
    expect(screen.getByText('Loading plans...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: [],
      selectedPlan: null,
      status: 'error',
      error: 'Failed to load plans',
      switchPlan: jest.fn(),
    });

    render(<PlanSwitcher />);
    expect(screen.getByText('Failed to load plans')).toBeInTheDocument();
  });

  it('calls onPlanSwitch when a plan is selected', async () => {
    const mockSwitchPlan = jest.fn().mockResolvedValue(undefined);
    const mockOnPlanSwitch = jest.fn();

    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: mockPlans,
      selectedPlan: mockPlans[0],
      status: 'success',
      error: null,
      switchPlan: mockSwitchPlan,
    });

    render(<PlanSwitcher onPlanSwitch={mockOnPlanSwitch} />);

    fireEvent.click(screen.getByText('Dental Plan'));

    await waitFor(() => {
      expect(mockSwitchPlan).toHaveBeenCalledWith('plan2');
      expect(mockOnPlanSwitch).toHaveBeenCalledWith(mockPlans[1]);
    });
  });

  it('disables plan selection while switching', () => {
    (usePlanSwitcher as jest.Mock).mockReturnValue({
      plans: mockPlans,
      selectedPlan: mockPlans[0],
      status: 'switching',
      error: null,
      switchPlan: jest.fn(),
    });

    render(<PlanSwitcher />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
