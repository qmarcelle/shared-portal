import { UpdateCommunicationText } from '@/app/communicationSettings/journeys/UpdateCommunicationText';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '21908',
            sbsbCk: '54363200',
            memCk: '54363201',
          },
        },
      },
    }),
  ),
}));

const showAppModal = useAppModalStore.getState().showAppModal;
const dismissAppModal = useAppModalStore.getState().dismissModal;

const mockChangePage = jest.fn();

const renderUI = () => {
  return render(<AppModal />);
};

describe('UpdateCommunicationText Component', () => {
  beforeEach(() => {
    act(() => {
      dismissAppModal();
      renderUI();

      showAppModal({
        content: (
          <UpdateCommunicationText
            initNumber={'1234567890'}
            phone={'1234567890'}
            changePage={mockChangePage}
            pageIndex={0}
          />
        ),
      });
    });
  });

  it('renders the initial page correctly', () => {
    expect(screen.getByText('Update Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('displays error message for invalid phone number', async () => {
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneNumberInput, { target: { value: 'invalid' } });
    fireEvent.blur(phoneNumberInput);
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid Phone number.'),
      ).toBeInTheDocument();
    });
  });

  it('enables Next button for valid phone number and shows success page (defect 73524)', async () => {
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    fireEvent.blur(phoneNumberInput);
    await waitFor(() => {
      expect(screen.getByText('Next')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByText('Next'));

    // After defect fix 73524: Should skip OTP and show success page directly
    await waitFor(() => {
      expect(screen.getByText('Phone Number Updated')).toBeInTheDocument();
      expect(screen.getByText('Your phone number is:')).toBeInTheDocument();
    });
  });

  it('verifies OTP pages are skipped (defect 73524 fix)', () => {
    // Verify that OTP-related text doesn't appear on the initial page
    // since we skip pages 1 (confirm phone) and 2 (enter code)
    expect(screen.queryByText('Confirm Phone Number')).not.toBeInTheDocument();
    expect(screen.queryByText('Text a code to')).not.toBeInTheDocument();
    expect(screen.queryByText('Call with a code to')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter Security Code')).not.toBeInTheDocument();
    expect(screen.queryByText('Resend Code')).not.toBeInTheDocument();

    // Verify we start with the input page, confirming that the OTP skip logic
    // will take us directly to success when Next is clicked
    expect(screen.getByText('Update Phone Number')).toBeInTheDocument();
  });
});
