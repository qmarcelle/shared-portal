import { LoginStore, useLoginStore } from '@/app/(main)/login/stores/loginStore';
import { AddMFAAuthenticatorJourney } from '@/app/(main)/security/components/journeys/AddMFAAuthenticatorJourney';
import { MfaDeviceType } from '@/app/(main)/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.setTimeout(30000);
const setupUI = () => {
  render(<AppModal />);
};

const showAppModal = useAppModalStore.getState().showAppModal;

describe('Verify MFA Authenticator errors', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should call verifyDevices api and render appropriate message on axios error', async () => {
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

    setupUI();
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });

    await waitFor(() => {
      screen.getByLabelText(/Enter Security Code/i);
    });

    const verifyError = createAxiosErrorForTest({
      errorObject: {
        data: {},
        details: {
          componentName: 'string',
          componentStatus: 'string',
          returnCode: 'MF-402',
          subSystemName: 'string',
          message: 'string',
          problemTypes: 'string',
          innerDetails: {
            statusDetails: [
              {
                componentName: 'string',
                componentStatus: 'string',
                returnCode: 'string',
                subSystemName: 'string',
                message: 'string',
                problemTypes: 'string',
                innerDetails: {
                  statusDetails: ['string'],
                },
              },
            ],
          },
        },
      },
    });
    mockedAxios.post.mockRejectedValueOnce(verifyError);
    const codeEntryInput = screen.getByLabelText(/Enter Security Code/i);
    await act(async () => {
      await userEvent.type(codeEntryInput, '123456');
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).toBeVisible();
    });

    // Should call the api with correct values
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/verifyDevices',
      {
        deviceType: MfaDeviceType.authenticator,
        OTP: '123456',
        userId: 'xxxx',
      },
    );
  });
});
