import { AddMFAVoiceJourney } from '@/app/security/components/journeys/AddMFAVoiceJourney';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedAxios } from '../../../__mocks__/axios';

const renderUI = () => {
  return render(<AppModal />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('test1234')),
}));

describe('Add Mfa Voice Journey', () => {
  let component: RenderResult;
  beforeEach(() => {
    const { showAppModal, dismissModal } = useAppModalStore.getState();
    dismissModal();
    component = renderUI();
    showAppModal({ content: <AddMFAVoiceJourney initNumber="1234567834" /> });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '11111111111');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          'Enter the 6-digit security code you heard to complete voice setup.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {
          data: { errorCode: 'INVALID_OTP' },
        },
        status: 400,
      }),
    );
    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).toBeVisible();
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          deviceStatus: 'ACTIVE',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chrishall@abc.com',
        },
      },
    });
    const codeEntryInput = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(codeEntryInput, '123456');
    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Voice Call Setup is Complete' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should show error when we input invalid phone number', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '5677');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid Phone Number')).toBeVisible();
    });
  });
});
