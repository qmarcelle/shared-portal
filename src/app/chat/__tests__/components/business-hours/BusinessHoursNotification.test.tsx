import { fireEvent, render, screen } from '@testing-library/react';
import { BusinessHours } from '../../../types/genesys';
import { BusinessHoursNotification } from '../../../components/BusinessHoursNotification';

describe('BusinessHoursNotification', () => {
  const mockBusinessHours: BusinessHours = {
    isOpen24x7: false,
    days: [
      {
        day: 'Monday',
        openTime: '09:00',
        closeTime: '17:00',
        isOpen: true,
      },
      {
        day: 'Tuesday',
        openTime: '09:00',
        closeTime: '17:00',
        isOpen: true,
      },
    ],
    timezone: 'UTC',
    isCurrentlyOpen: true,
    lastUpdated: Date.now(),
    source: 'api',
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with business hours', () => {
    render(
      <BusinessHoursNotification
        businessHours={mockBusinessHours}
        onClose={mockOnClose}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /Business Hours/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our current business hours are:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Monday: 9:00 AM - 5:00 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/Tuesday: 9:00 AM - 5:00 PM/i)).toBeInTheDocument();
  });

  it('renders 24/7 message when isOpen24x7 is true', () => {
    const twentyFourSevenHours: BusinessHours = {
      ...mockBusinessHours,
      isOpen24x7: true,
    };

    render(
      <BusinessHoursNotification
        businessHours={twentyFourSevenHours}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText(/available 24\/7/i)).toBeInTheDocument();
    expect(screen.queryByText(/Monday/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <BusinessHoursNotification
        businessHours={mockBusinessHours}
        onClose={mockOnClose}
      />,
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('formats time correctly', () => {
    render(
      <BusinessHoursNotification
        businessHours={mockBusinessHours}
        onClose={mockOnClose}
      />,
    );

    // Check that times are formatted in 12-hour format with AM/PM
    expect(screen.getAllByText(/9:00 AM/i)).toHaveLength(2);
    expect(screen.getAllByText(/5:00 PM/i)).toHaveLength(2);
  });

  it('handles different time formats', () => {
    const customHours: BusinessHours = {
      ...mockBusinessHours,
      days: [
        {
          day: 'Wednesday',
          openTime: '13:00',
          closeTime: '21:00',
          isOpen: true,
        },
      ],
    };

    render(
      <BusinessHoursNotification
        businessHours={customHours}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText(/1:00 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/9:00 PM/i)).toBeInTheDocument();
  });

  it('shows next opening time when currently closed', () => {
    const closedHours: BusinessHours = {
      ...mockBusinessHours,
      isCurrentlyOpen: false,
      nextOpeningTime: '09:00',
    };

    render(
      <BusinessHoursNotification
        businessHours={closedHours}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText(/We will be open at/i)).toBeInTheDocument();
    expect(
      screen.getByText(/9:00 AM/i, { selector: '.next-opening' }),
    ).toBeInTheDocument();
  });
});
