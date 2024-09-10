import { AddMFAEmailJourney } from '@/app/security/components/journeys/AddMFAEmailJourney';
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

describe('Add Mfa Email Journey', () => {
  let component: RenderResult;
  beforeEach(() => {
    const { showAppModal, dismissModal } = useAppModalStore.getState();
    dismissModal();
    component = renderUI();
    showAppModal({
      content: <AddMFAEmailJourney email="chall123@gmail.com" />,
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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
    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Enter the security code sent to your email to complete email setup.We've sent a code to:",
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
    // fire Resend code button to show Code Resent text
    fireEvent.click(screen.getByRole('button', { name: /Resend Code/i }));
    expect(screen.getByText('Code resent!')).toBeVisible();

    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // showing error message after entering wrong security code
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
    fireEvent.click(screen.getByText(/Back/i));

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
        screen.getByRole('heading', { name: 'Email Setup is Complete' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should show error when we input invalid Email Address', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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
    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123gmail.com');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid Email Address')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
