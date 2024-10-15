import { AddMFAAuthenticatorJourney } from '@/app/security/components/journeys/AddMFAAuthenticatorJourney';
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

describe('Authenticator App Setup', () => {
  let component: RenderResult;
  const showAppModal = useAppModalStore.getState().showAppModal;
  const dismissAppModal = useAppModalStore.getState().dismissModal;
  beforeEach(() => {
    dismissAppModal();
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'thomas@abc.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    component = renderUI();
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Authenticator App Setup' }),
      ).toBeVisible();
      expect(screen.getByText('Secret Key:')).toBeVisible();
      expect(
        screen.getByText('ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ'),
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
          email: 'thomas@abc.com',
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
        screen.getByRole('heading', {
          name: 'Authenticator App Setup Complete',
        }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render the screens without error when we close the modal previously with error', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Authenticator App Setup' }),
      ).toBeVisible();
      expect(screen.getByText('Secret Key:')).toBeVisible();
      expect(
        screen.getByText('ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ'),
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
    fireEvent.click(screen.getByAltText('close'));
    await waitFor(() => {
      expect(
        screen.queryByText('Authenticator App Setup'),
      ).not.toBeInTheDocument();
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'thomas@abc.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });

    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
