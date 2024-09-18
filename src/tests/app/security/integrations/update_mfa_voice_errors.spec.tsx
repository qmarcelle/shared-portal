import { LoginStore, useLoginStore } from '@/app/login/stores/loginStore';
import { AddMFAVoiceJourney } from '@/app/security/components/journeys/AddMFAVoiceJourney';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setupUI = () => {
  render(<AppModal />);
};
const showAppModal = useAppModalStore.getState().showAppModal;
const dismissModal = useAppModalStore.getState().dismissModal;

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));
describe('Update Mfa Voice Authentication Errors', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should render Error slide on error from update device on generic error', async () => {
    mockedAxios.post.mockRejectedValueOnce({});
    setupUI();
    showAppModal({
      content: <AddMFAVoiceJourney initNumber={'11111111111'} />,
    });

    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
    await userEvent.type(phoneEntryInput, '11111111111');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.voice,
          phone: '11111111111',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  it('should render Error slide on error from update device on axios error', async () => {
    const updateError = createAxiosErrorForTest({
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
    mockedAxios.post.mockRejectedValueOnce(updateError);
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAVoiceJourney initNumber={'11111111111'} />,
    });

    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
    await userEvent.type(phoneEntryInput, '11111111111');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.voice,
          phone: '11111111111',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  test('Update Mfa Devices 400 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 400,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAVoiceJourney initNumber={'11111111111'} />,
    });

    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
    await userEvent.type(phoneEntryInput, '11111111111');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Update Mfa Devices 408 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 408,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAVoiceJourney initNumber={'11111111111'} />,
    });

    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
    await userEvent.type(phoneEntryInput, '11111111111');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Update Mfa Devices 500 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 500,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAVoiceJourney initNumber={'11111111111'} />,
    });

    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });

    const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
    await userEvent.type(phoneEntryInput, '11111111111');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
});
