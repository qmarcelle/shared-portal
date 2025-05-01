import { render, screen } from '@testing-library/react';
import { UserEligibility } from '../../../types/genesys';
import { EligibilityCheck } from '../../../components/EligibilityCheck';

describe('EligibilityCheck', () => {
  const mockEligibility: UserEligibility = {
    isChatEligibleMember: true,
    isDemoMember: false,
    isAmplifyMem: false,
    groupId: 'TEST_GROUP',
    memberClientID: 'TEST_CLIENT',
    getGroupType: 'REGULAR',
    isBlueEliteGroup: false,
    isMedical: true,
    isDental: true,
    isVision: true,
    isWellnessOnly: false,
    isCobraEligible: false,
    chatHours: 'Monday-Friday, 9:00 AM - 5:00 PM',
    rawChatHours: 'M_F_9_5',
    isChatbotEligible: true,
    memberMedicalPlanID: 'TEST_PLAN',
    isIDCardEligible: true,
    memberDOB: '1990-01-01',
    subscriberID: 'TEST_SUB',
    sfx: 'TEST',
    memberFirstname: 'John',
    memberLastName: 'Doe',
    userID: 'TEST_USER',
    isChatAvailable: true,
    routingchatbotEligible: true,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders eligibility status correctly', () => {
    render(
      <EligibilityCheck eligibility={mockEligibility} onClose={mockOnClose} />,
    );

    // Check if the header is rendered
    expect(screen.getByText('Eligibility Status')).toBeInTheDocument();

    // Check if the status message is rendered
    expect(
      screen.getByText('You are eligible for chat services.'),
    ).toBeInTheDocument();

    // Check if coverage details are displayed
    expect(screen.getByText('Coverage Details')).toBeInTheDocument();

    // Check coverage items using a more flexible matcher
    const medicalItem = screen.getByText((content, element) => {
      const isListItem = element?.tagName.toLowerCase() === 'li';
      const hasMedical = element?.textContent?.includes('Medical') ?? false;
      const hasCovered = element?.textContent?.includes('Covered') ?? false;
      return isListItem && hasMedical && hasCovered;
    });
    expect(medicalItem).toBeInTheDocument();

    const dentalItem = screen.getByText((content, element) => {
      const isListItem = element?.tagName.toLowerCase() === 'li';
      const hasDental = element?.textContent?.includes('Dental') ?? false;
      const hasCovered = element?.textContent?.includes('Covered') ?? false;
      return isListItem && hasDental && hasCovered;
    });
    expect(dentalItem).toBeInTheDocument();

    const visionItem = screen.getByText((content, element) => {
      const isListItem = element?.tagName.toLowerCase() === 'li';
      const hasVision = element?.textContent?.includes('Vision') ?? false;
      const hasCovered = element?.textContent?.includes('Covered') ?? false;
      return isListItem && hasVision && hasCovered;
    });
    expect(visionItem).toBeInTheDocument();

    // Check if chat hours are displayed
    expect(screen.getByText('Chat Hours')).toBeInTheDocument();
    expect(
      screen.getByText('Monday-Friday, 9:00 AM - 5:00 PM'),
    ).toBeInTheDocument();

    // Check if close button is rendered
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('renders not eligible message when isChatEligibleMember is false', () => {
    const notEligible: UserEligibility = {
      ...mockEligibility,
      isChatEligibleMember: false,
    };

    render(
      <EligibilityCheck eligibility={notEligible} onClose={mockOnClose} />,
    );

    expect(
      screen.getByText(
        'You are not eligible for chat services with your current plan.',
      ),
    ).toBeInTheDocument();
  });

  it('renders demo account message when isDemoMember is true', () => {
    const demoAccount: UserEligibility = {
      ...mockEligibility,
      isDemoMember: true,
    };

    render(
      <EligibilityCheck eligibility={demoAccount} onClose={mockOnClose} />,
    );

    expect(
      screen.getByText(
        'You are using a demo account. Some features may be limited.',
      ),
    ).toBeInTheDocument();
  });

  it('displays wellness only when isWellnessOnly is true', () => {
    const wellnessOnly: UserEligibility = {
      ...mockEligibility,
      isWellnessOnly: true,
    };

    render(
      <EligibilityCheck eligibility={wellnessOnly} onClose={mockOnClose} />,
    );

    const wellnessItem = screen.getByText((content, element) => {
      const isListItem = element?.tagName.toLowerCase() === 'li';
      const hasWellness =
        element?.textContent?.includes('Wellness Only') ?? false;
      const hasYes = element?.textContent?.includes('Yes') ?? false;
      return isListItem && hasWellness && hasYes;
    });
    expect(wellnessItem).toBeInTheDocument();
  });

  it('displays COBRA eligibility when isCobraEligible is true', () => {
    const cobraEligible: UserEligibility = {
      ...mockEligibility,
      isCobraEligible: true,
    };

    render(
      <EligibilityCheck eligibility={cobraEligible} onClose={mockOnClose} />,
    );

    const cobraItem = screen.getByText((content, element) => {
      const isListItem = element?.tagName.toLowerCase() === 'li';
      const hasCobra =
        element?.textContent?.includes('COBRA Eligible') ?? false;
      const hasYes = element?.textContent?.includes('Yes') ?? false;
      return isListItem && hasCobra && hasYes;
    });
    expect(cobraItem).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <EligibilityCheck eligibility={mockEligibility} onClose={mockOnClose} />,
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
