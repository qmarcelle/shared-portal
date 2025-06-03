import { UpdateCommunicationEmail } from '@/app/communicationSettings/journeys/UpdateCommunicationEmail';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
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

describe('communication settings update email API Integration', () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValueOnce({
      details: {
        componentStatus: 'Success',
      },
    });
    act(() => {
      dismissAppModal();
      renderUI();

      showAppModal({
        content: (
          <UpdateCommunicationEmail
            changePage={mockChangePage}
            email={'test@bcbst.com'}
          />
        ),
      });
    });
  });

  test('communication Information save API integration success scenario', async () => {
    const emailInput = screen.getByLabelText('Email Address');
    const saveButton = screen.getByText('Next');

    // Initially, the button should be disabled
    expect(saveButton).toBeDisabled();

    // Enter the new email address
    fireEvent.change(emailInput, { target: { value: '' } });
    // Enter a valid new email address
    fireEvent.change(emailInput, { target: { value: 'test@bcbst.com' } });

    // Confirm email input should now be visible
    const confirmEmailInput = screen.getByLabelText('Confirm Email');
    expect(confirmEmailInput).toBeVisible();

    // Enter the confirmation email
    fireEvent.change(confirmEmailInput, {
      target: { value: 'test@bcbst.com' },
    });

    // Click the button
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/memberEmailAddress', {
        memberKey: '54363201',
        subscriberKey: '54363200',
        emailAddress: 'test@bcbst.com',
      });
      // expect(screen.getByText('Email Address Updated')).toBeVisible();
    });
  });
  test('communication Information save API integration Failure scenario', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      details: {
        componentStatus: 'Failure',
      },
    });
    const emailInput = screen.getByLabelText('Email Address');
    const saveButton = screen.getByText('Next');

    // Initially, the button should be disabled
    expect(saveButton).toBeDisabled();

    // Enter the new email address
    fireEvent.change(emailInput, { target: { value: '' } });
    // Enter a valid new email address
    fireEvent.change(emailInput, { target: { value: 'test@bcbst.com' } });

    // Confirm email input should now be visible
    const confirmEmailInput = screen.getByLabelText('Confirm Email');
    expect(confirmEmailInput).toBeVisible();

    // Enter the confirmation email
    fireEvent.change(confirmEmailInput, {
      target: { value: 'test@bcbst.com' },
    });

    // Click the button
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/memberEmailAddress', {
        memberKey: '54363201',
        subscriberKey: '54363200',
        emailAddress: 'test@bcbst.com',
      });
      expect(screen.getByText('Something went wrong.')).toBeVisible();
    });
  });
});
