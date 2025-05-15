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

  it('enables Next button for valid phone number and calls changePage', async () => {
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    fireEvent.blur(phoneNumberInput);
    await waitFor(() => {
      expect(screen.getByText('Next')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Confirm Phone Number')).toBeVisible();
  });
});
