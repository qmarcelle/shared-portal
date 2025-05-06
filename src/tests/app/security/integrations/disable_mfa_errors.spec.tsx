import { LoginStore, useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
import { DisableMFAJourney } from '@/app/(protected)/(common)/member/security/components/journeys/DisableMFAJourney';
import { MfaDeviceType } from '@/app/(protected)/(common)/member/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setupUI = () => {
  render(<AppModal />);
};

const showAppModal = useAppModalStore.getState().showAppModal;
const dismissModal = useAppModalStore.getState().dismissModal;
jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));
describe('Disable Mfa Errors', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should render Error slide on delete device generic error', async () => {
    mockedAxios.post.mockRejectedValueOnce({});
    setupUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
    await waitFor(() => {
      screen.getByRole('button', { name: /Turn Off Method/i });
    });
    const turnOffButton = screen.getByRole('button', {
      name: /Turn Off Method/i,
    });

    userEvent.click(turnOffButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/deleteDevices',
        {
          deviceType: 'email',
          email: 'xyz@abc.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  it('should render Error slide on delete device axios error', async () => {
    const disableError = createAxiosErrorForTest({
      errorObject: {
        data: {},
      },
    });
    mockedAxios.post.mockRejectedValueOnce(disableError);
    dismissModal();
    setupUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
    await waitFor(() => {
      screen.getByRole('button', { name: /Turn Off Method/i });
    });
    const turnOffButton = screen.getByRole('button', {
      name: /Turn Off Method/i,
    });

    userEvent.click(turnOffButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/deleteDevices',
        {
          deviceType: 'email',
          email: 'xyz@abc.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  it('should render Error slide on HTTP 400 error', async () => {
    const disableError = createAxiosErrorForTest({
      errorObject: {
        data: {},
      },
      status: 400,
    });
    mockedAxios.post.mockRejectedValueOnce(disableError);
    dismissModal();
    setupUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
    await waitFor(() => {
      screen.getByRole('button', { name: /Turn Off Method/i });
    });
    const turnOffButton = screen.getByRole('button', {
      name: /Turn Off Method/i,
    });

    userEvent.click(turnOffButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/deleteDevices',
        {
          deviceType: 'email',
          email: 'xyz@abc.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  it('should render Error slide on HTTP 408 error', async () => {
    const disableError = createAxiosErrorForTest({
      errorObject: {
        data: {},
      },
      status: 408,
    });
    mockedAxios.post.mockRejectedValueOnce(disableError);
    dismissModal();
    setupUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
    await waitFor(() => {
      screen.getByRole('button', { name: /Turn Off Method/i });
    });
    const turnOffButton = screen.getByRole('button', {
      name: /Turn Off Method/i,
    });

    userEvent.click(turnOffButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/deleteDevices',
        {
          deviceType: 'email',
          email: 'xyz@abc.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  it('should render Error slide on HTTP 500 error', async () => {
    const disableError = createAxiosErrorForTest({
      errorObject: {
        data: {},
      },
      status: 500,
    });
    mockedAxios.post.mockRejectedValueOnce(disableError);
    dismissModal();
    setupUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
    await waitFor(() => {
      screen.getByRole('button', { name: /Turn Off Method/i });
    });
    const turnOffButton = screen.getByRole('button', {
      name: /Turn Off Method/i,
    });

    userEvent.click(turnOffButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/deleteDevices',
        {
          deviceType: 'email',
          email: 'xyz@abc.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });
});
